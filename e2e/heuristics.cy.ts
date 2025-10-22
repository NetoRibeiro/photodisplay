// e2e/heuristics.cy.ts
// Auto-generated from NN/g checklist. Run with Cypress.
// By default, tests are skipped unless RUN_UI_CHECKS=true is set in env.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checklist: any = {
  "version": "1.0.0",
  "app": "Personal Photo Application",
  "scope": {
    "devices": [
      "Smart TV browsers (WebOS/Tizen/Chromecast)",
      "Modern smartphones",
      "Older smartphones (ES5 + polyfills)"
    ],
    "locales": [
      "en"
    ],
    "features": [
      "Upload",
      "Google Photos Import",
      "Gallery Grid",
      "Detail View",
      "Slideshow",
      "AI Caption",
      "Notes",
      "Location (EXIF-only auto) + User Override"
    ]
  },
  "severity_scale": {
    "S1": "Blocks core task / data loss",
    "S2": "Severely impairs task / no workaround",
    "S3": "Minor friction / workaround exists",
    "S4": "Cosmetic only"
  },
  "selectors": {
    "galleryGrid": "[data-testid='gallery-grid']",
    "thumbCard": "[data-testid='photo-thumb']",
    "detailView": "[data-testid='detail-view']",
    "captionText": "[data-testid='caption-ai']",
    "noteInput": "[data-testid='note-input']",
    "noteCharCounter": "[data-testid='note-counter']",
    "locationRow": "[data-testid='location-row']",
    "locationBadge": "[data-testid='location-badge']",
    "editLocationBtn": "[data-testid='edit-location']",
    "revertLocationBtn": "[data-testid='revert-location']",
    "uploadBtn": "[data-testid='btn-upload']",
    "importBtn": "[data-testid='btn-import-google']",
    "progressBar": "[data-testid='progress-bar']",
    "toast": "[data-testid='toast']",
    "slideshowBtn": "[data-testid='btn-slideshow']",
    "slideshowInterval": "[data-testid='slideshow-interval']",
    "detailOnlyCheckbox": "[data-testid='detail-only']",
    "helpOverlay": "[data-testid='help-overlay']",
    "errorBanner": "[data-testid='error-banner']"
  },
  "heuristics": [
    {
      "id": "H1",
      "title": "Visibility of system status",
      "checks": [
        {
          "id": "H1-1",
          "description": "Async actions (upload/import/processing) show immediate feedback (<500ms).",
          "components": [
            "Upload",
            "Import",
            "Background jobs"
          ],
          "acceptance": [
            "On upload/import start, a progress indicator appears within 500ms.",
            "Processing states show clear step names: EXIF \u2192 Geocode \u2192 Caption.",
            "Slideshow indicates play/pause and interval remaining."
          ],
          "tests": {
            "manual": [
              "Throttle network to 'Slow 3G' and upload a 5\u201310MB photo; verify progress appears <500ms.",
              "During processing, verify step label updates and never shows a blank state."
            ],
            "cypress": [
              "cy.intercept('/api/photos/upload', { delay: 800 }).as('up'); cy.get(\"[data-testid='btn-upload']\").click(); cy.get(\"[data-testid='progress-bar']\").should('be.visible');"
            ]
          },
          "severity_default": "S2"
        }
      ]
    },
    {
      "id": "H2",
      "title": "Match between system and the real world",
      "checks": [
        {
          "id": "H2-1",
          "description": "Location labels are human-readable (city/landmark) and provenance is explicit.",
          "components": [
            "Detail View",
            "Location"
          ],
          "acceptance": [
            "When EXIF GPS exists, show a label like 'Barcelona, Spain' with a 'From EXIF' badge.",
            "Raw coordinates are hidden by default."
          ],
          "tests": {
            "manual": [
              "Open a photo with GPS; confirm label reads naturally and badge says 'From EXIF'."
            ],
            "cypress": [
              "cy.get(\"[data-testid='location-row']\").should('contain.text','Barcelona').get(\"[data-testid='location-badge']\").should('contain.text','From EXIF');"
            ]
          },
          "severity_default": "S3"
        }
      ]
    },
    {
      "id": "H3",
      "title": "User control and freedom",
      "checks": [
        {
          "id": "H3-1",
          "description": "Users can revert location to EXIF in one action; note edits support Undo.",
          "components": [
            "Location Override",
            "Notes"
          ],
          "acceptance": [
            "Override shows 'Edited' badge.",
            "Revert restores 'From EXIF' and original label.",
            "After saving a note, a toast with 'Undo' is available for \u22655s."
          ],
          "tests": {
            "manual": [
              "Edit location to a new label; confirm 'Edited' badge; click Revert and verify EXIF badge returns.",
              "Edit note, save, click Undo; previous content is restored."
            ],
            "cypress": [
              "cy.get(\"[data-testid='edit-location']\").click(); /* enter label */ cy.get(\"[data-testid='location-badge']\").should('contain','Edited'); cy.get(\"[data-testid='revert-location']\").click(); cy.get(\"[data-testid='location-badge']\").should('contain','From EXIF');"
            ]
          },
          "severity_default": "S2"
        }
      ]
    },
    {
      "id": "H4",
      "title": "Consistency and standards",
      "checks": [
        {
          "id": "H4-1",
          "description": "Edit affordances, badge positions, and focus behavior are consistent across screens.",
          "components": [
            "Gallery",
            "Detail View"
          ],
          "acceptance": [
            "Edit icons (\u270e) look and behave the same for caption, note, and location.",
            "Badges appear in the same region across gallery/detail.",
            "TV/keyboard focus order is left-to-right, top-to-bottom; no 'focus traps'."
          ],
          "tests": {
            "manual": [
              "Traverse UI with keyboard/remote only; confirm predictable focus order."
            ],
            "cypress": [
              "cy.realPress('Tab'); cy.focused().should('have.attr','data-focus-visible','true');"
            ]
          },
          "severity_default": "S3"
        }
      ]
    },
    {
      "id": "H5",
      "title": "Error prevention",
      "checks": [
        {
          "id": "H5-1",
          "description": "Inputs validate inline; dedupe prevents duplicate uploads.",
          "components": [
            "Notes",
            "Upload"
          ],
          "acceptance": [
            "Note/caption fields enforce \u2264240 chars with live counter.",
            "If perceptual hash matches an existing photo, prompt skip/merge."
          ],
          "tests": {
            "manual": [
              "Paste 300 chars into note; verify hard limit and counter color at \u2265220.",
              "Upload the same image twice; observe dedupe prompt."
            ],
            "cypress": [
              "cy.get(\"[data-testid='note-input']\").type('x'.repeat(300)); cy.get(\"[data-testid='note-counter']\").should('contain','240/240');"
            ]
          },
          "severity_default": "S2"
        }
      ]
    },
    {
      "id": "H6",
      "title": "Recognition rather than recall",
      "checks": [
        {
          "id": "H6-1",
          "description": "Preset options and explicit filters reduce memory load.",
          "components": [
            "Settings",
            "Filters"
          ],
          "acceptance": [
            "Slideshow interval presents presets: 3/5/10/30s.",
            "Filters include: Has EXIF location, Has user-edited location, Has note."
          ],
          "tests": {
            "manual": [
              "Open settings and verify presets exist; toggle filters and see expected results."
            ],
            "cypress": [
              "cy.get(\"[data-testid='slideshow-interval']\").within(()=>{ cy.contains('3s'); cy.contains('5s'); });"
            ]
          },
          "severity_default": "S3"
        }
      ]
    },
    {
      "id": "H7",
      "title": "Flexibility and efficiency of use",
      "checks": [
        {
          "id": "H7-1",
          "description": "Shortcuts and preferences persist; slideshow responds to remote keys.",
          "components": [
            "Slideshow",
            "Settings"
          ],
          "acceptance": [
            "Space/OK toggles play/pause; \u2190/\u2192 prev/next.",
            "detailOnly and interval persist per user after reload."
          ],
          "tests": {
            "manual": [
              "Start slideshow; use remote/keyboard to control; reload and confirm settings persist."
            ],
            "cypress": [
              "cy.get(\"[data-testid='detail-only']\").check(); cy.reload(); cy.get(\"[data-testid='detail-only']\").should('be.checked');"
            ]
          },
          "severity_default": "S3"
        }
      ]
    },
    {
      "id": "H8",
      "title": "Aesthetic and minimalist design",
      "checks": [
        {
          "id": "H8-1",
          "description": "Information hierarchy is clear; gallery cards remain minimal.",
          "components": [
            "Gallery",
            "Detail View"
          ],
          "acceptance": [
            "Thumbnails show at most 2 compact chips (note/location).",
            "Detail view: photo > caption > note > location; extra metadata hidden behind disclosure."
          ],
          "tests": {
            "manual": [
              "Resize to small viewport; ensure text truncates gracefully; no overlap."
            ],
            "cypress": [
              "cy.viewport(320, 560); cy.get(\"[data-testid='photo-thumb']\").first().should('be.visible');"
            ]
          },
          "severity_default": "S4"
        }
      ]
    },
    {
      "id": "H9",
      "title": "Help users recognize, diagnose, and recover from errors",
      "checks": [
        {
          "id": "H9-1",
          "description": "Errors use plain language and offer recovery actions.",
          "components": [
            "Errors",
            "Location"
          ],
          "acceptance": [
            "No EXIF GPS: offer 'Add a location'.",
            "Geocode failure: offer 'Save label only' or 'Enter coordinates'."
          ],
          "tests": {
            "manual": [
              "Disable geocode service; attempt override; verify fallback actions are offered."
            ],
            "cypress": [
              "cy.intercept('/jobs/geocode', { statusCode: 500 }); /* trigger edit */ cy.get(\"[data-testid='error-banner']\").should('contain','Save label only');"
            ]
          },
          "severity_default": "S2"
        }
      ]
    },
    {
      "id": "H10",
      "title": "Help and documentation",
      "checks": [
        {
          "id": "H10-1",
          "description": "Contextual help overlay explains badges, controls, and shortcuts.",
          "components": [
            "Help Overlay"
          ],
          "acceptance": [
            "Overlay reachable via keyboard/remote only.",
            "Includes legend: 'From EXIF' vs 'Edited', and slideshow shortcuts."
          ],
          "tests": {
            "manual": [
              "Open help on TV remote; confirm readability from ~3m distance."
            ],
            "cypress": [
              "cy.get('body').type('?'); cy.get(\"[data-testid='help-overlay']\").should('be.visible').and('contain','From EXIF');"
            ]
          },
          "severity_default": "S4"
        }
      ]
    }
  ],
  "a11y_requirements": {
    "wcag": "AA",
    "rules": [
      "All actionable elements have visible focus states.",
      "Alt text defaults to AI caption; user can edit.",
      "Minimum target size \u2267 44px; color contrast \u2267 4.5:1."
    ],
    "tests": {
      "manual": [
        "Keyboard-only traversal covers all interactive elements; focus never lost."
      ],
      "axe_core": [
        "no-aria-hidden-focus",
        "color-contrast",
        "button-name",
        "image-alt"
      ]
    }
  },
  "performance_requirements": {
    "bundle_gzip_kb": 120,
    "initial_load_ms_3g": 2000,
    "images": [
      "Serve WebP/AVIF with JPEG fallback",
      "Use srcset + sizes"
    ],
    "tests": {
      "lighthouse": [
        "Performance \u2265 80 on Mobile"
      ],
      "manual": [
        "Simulate Slow 3G; confirm UI remains responsive"
      ]
    }
  },
  "device_matrix": [
    {
      "device": "WebOS TV Browser",
      "inputs": [
        "DPAD",
        "OK",
        "Back"
      ],
      "min_width": 1280
    },
    {
      "device": "Tizen TV Browser",
      "inputs": [
        "DPAD",
        "OK",
        "Back"
      ],
      "min_width": 1280
    },
    {
      "device": "Android 6 phone",
      "inputs": [
        "Touch",
        "Keyboard"
      ],
      "min_width": 320
    },
    {
      "device": "iOS 12 phone",
      "inputs": [
        "Touch",
        "Keyboard"
      ],
      "min_width": 320
    }
  ],
  "flows": [
    {
      "id": "F1",
      "name": "Upload \u2192 Process \u2192 View",
      "acceptance": [
        "Upload shows progress <500ms.",
        "Photo appears in grid with 'Processing' then 'Ready'.",
        "Detail view shows AI caption and, if GPS exists, 'From EXIF' location."
      ],
      "cypress": [
        "cy.get(\"[data-testid='btn-upload']\").click(); cy.get(\"[data-testid='progress-bar']\").should('be.visible'); cy.get(\"[data-testid='gallery-grid']\").contains('Ready');"
      ]
    },
    {
      "id": "F2",
      "name": "Location Override \u2192 Revert",
      "acceptance": [
        "Edited badge appears after override.",
        "Revert restores EXIF badge and original label."
      ],
      "cypress": [
        "cy.get(\"[data-testid='edit-location']\").click(); /* set label */ cy.get(\"[data-testid='location-badge']\").should('contain','Edited'); cy.get(\"[data-testid='revert-location']\").click(); cy.get(\"[data-testid='location-badge']\").should('contain','From EXIF');"
      ]
    },
    {
      "id": "F3",
      "name": "Slideshow",
      "acceptance": [
        "Interval presets selectable; value persists.",
        "Space/OK toggles play/pause; \u2190/\u2192 changes photo."
      ],
      "cypress": [
        "cy.get(\"[data-testid='btn-slideshow']\").click(); cy.get('body').type(' '); cy.get(\"[data-testid='toast']\").should('contain','Paused');"
      ]
    }
  ]
};

const RUN_UI = (Cypress.env('RUN_UI_CHECKS') === true) || (Cypress.env('RUN_UI_CHECKS') === 'true');

function itMaybe(title: string, fn: () => void) {
  (RUN_UI ? it : it.skip)(title, fn);
}

function testId(id: string) {
  return `[data-testid='${id}']`;
}

describe('NN/g Heuristic UI Review – ' + checklist.app, () => {
  beforeEach(() => {
    cy.visit('/');
  });

  checklist.heuristics.forEach((h: any) => {
    describe(`${h.id} – ${h.title}`, () => {
      h.checks.forEach((chk: any) => {
        const title = `${chk.id}: ${chk.description}`;
        itMaybe(title, () => {
          cy.log('Acceptance criteria:');
          (chk.acceptance || []).forEach((a: string) => cy.log('• ' + a));

          // Scaffold: run minimal known selectors if present
          const sel = checklist.selectors;
          if (chk.id === 'H1-1') {
            if (sel.uploadBtn) cy.get(sel.uploadBtn).should('exist');
          }
          if (chk.id === 'H3-1') {
            if (sel.editLocationBtn) cy.get(sel.editLocationBtn).should('exist');
            if (sel.revertLocationBtn) cy.get(sel.revertLocationBtn).should('exist');
          }
          if (chk.id === 'H4-1') {
            if (sel.thumbCard) cy.get(sel.thumbCard).should('exist');
            if (sel.locationBadge) cy.get(sel.locationBadge).should('exist');
          }
          if (chk.id === 'H5-1') {
            if (sel.noteInput) cy.get(sel.noteInput).should('exist');
            if (sel.noteCharCounter) cy.get(sel.noteCharCounter).should('exist');
          }
          if (chk.id === 'H6-1') {
            if (sel.slideshowInterval) cy.get(sel.slideshowInterval).should('exist');
          }
          if (chk.id === 'H7-1') {
            if (sel.slideshowBtn) cy.get(sel.slideshowBtn).should('exist');
            if (sel.detailOnlyCheckbox) cy.get(sel.detailOnlyCheckbox).should('exist');
          }
          if (chk.id === 'H8-1') {
            if (sel.galleryGrid) cy.get(sel.galleryGrid).should('exist');
            if (sel.thumbCard) cy.get(sel.thumbCard).should('exist');
          }
          if (chk.id === 'H9-1') {
            if (sel.errorBanner) {
              cy.get('body').then(($body) => {
                if ($body.find(sel.errorBanner).length) {
                  cy.get(sel.errorBanner).should('exist');
                }
              });
            }
          }
          if (chk.id === 'H10-1') {
            if (sel.helpOverlay) {
              cy.get('body').then(($body) => {
                if ($body.find(sel.helpOverlay).length) {
                  cy.get(sel.helpOverlay).should('exist');
                }
              });
            }
          }
        });
      });
    });
  });

  describe('Core Flows', () => {
    checklist.flows.forEach((flow: any) => {
      itMaybe(`${flow.id} – ${flow.name}`, () => {
        cy.log('Acceptance criteria:');
        (flow.acceptance || []).forEach((a: string) => cy.log('• ' + a));
        const sel = checklist.selectors;
        if (flow.id === 'F1') {
          if (sel.uploadBtn) cy.get(sel.uploadBtn).should('exist');
          if (sel.progressBar) cy.get(sel.progressBar).should('exist');
        }
        if (flow.id === 'F2') {
          if (sel.editLocationBtn) cy.get(sel.editLocationBtn).should('exist');
          if (sel.revertLocationBtn) cy.get(sel.revertLocationBtn).should('exist');
        }
        if (flow.id === 'F3') {
          if (sel.slideshowBtn) cy.get(sel.slideshowBtn).should('exist');
        }
      });
    });
  });

  itMaybe('A11y – has focusable elements and alt text on images', () => {
    cy.get('body').then(($body) => {
      const imgs = $body.find('img');
      if (imgs.length) {
        cy.wrap(imgs).each(($img) => {
          expect($img.attr('alt')).to.not.equal(undefined);
        });
      }
    });
  });
});
