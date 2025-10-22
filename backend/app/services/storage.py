import datetime as dt
from dataclasses import dataclass
from typing import Protocol

import boto3
from botocore.client import BaseClient
from app.config import get_settings

settings = get_settings()


def _client() -> BaseClient:
  return boto3.client('s3', region_name=settings.storage_region)


@dataclass
class SignedUrl:
  url: str
  expires_at: dt.datetime


class StorageService(Protocol):
  def create_upload_url(self, key: str, content_type: str) -> SignedUrl: ...
  def create_download_url(self, key: str) -> SignedUrl: ...


class S3StorageService:
  def __init__(self) -> None:
    self.client = _client()

  def create_upload_url(self, key: str, content_type: str) -> SignedUrl:
    expiration = settings.signed_url_ttl_seconds
    url = self.client.generate_presigned_post(
      Bucket=settings.storage_bucket,
      Key=key,
      Fields={'Content-Type': content_type},
      Conditions=[["content-length-range", 1, 25 * 1024 * 1024]],
      ExpiresIn=expiration
    )
    return SignedUrl(url=url['url'], expires_at=dt.datetime.utcnow() + dt.timedelta(seconds=expiration))

  def create_download_url(self, key: str) -> SignedUrl:
    expiration = settings.signed_url_ttl_seconds
    url = self.client.generate_presigned_url(
      ClientMethod='get_object',
      Params={'Bucket': settings.storage_bucket, 'Key': key},
      ExpiresIn=expiration
    )
    return SignedUrl(url=url, expires_at=dt.datetime.utcnow() + dt.timedelta(seconds=expiration))
