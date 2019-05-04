describe("partTypes", function() {
  beforeEach(() => {
    cy.visit("");
  });

  it(`should be able to add a part type`, () => {
    cy.get(".veRowViewSelectionLayer").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Part").click();
    cy.get(".tg-multi-select-wrapper").click();
    cy.contains(".tg-multi-select-option", "misc_RNA").click();
    cy.get(".tg-test-name input").type("test part");
    cy.get(".tg-test-end input").type("0");
    cy.get(".bp3-dialog-body")
      .contains("Save")
      .click();
    cy.contains(".veRowViewPart text", "test part").trigger("contextmenu", {
      force: true
    });
    cy.contains(".bp3-menu-item", "Edit Part").click();
    cy.get(".bp3-dialog-body").contains("misc_RNA");
  });

  it("should be able to make a part from feature", () => {
    cy.get(".veRowViewSelectionLayer").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Feature").click();
    cy.get(".tg-test-name input").type("test feature");
    cy.get(".tg-test-end input").type("0");
    cy.get(".tg-multi-select-wrapper").click();
    cy.contains(".tg-multi-select-option", "misc_RNA").click();
    cy.get(".bp3-dialog-body")
      .contains("Save")
      .click();
    cy.contains(".veRowViewFeaturesContainer text", "test feature").trigger(
      "contextmenu",
      { force: true }
    );
    cy.contains(".bp3-menu-item", "Make a Part from Feature").click();
    cy.contains(".veRowViewPart title", "test feature").trigger("contextmenu", {
      force: true
    });
    cy.contains(".bp3-menu-item", "Edit Part").click();
    cy.get(".bp3-dialog-body").contains("misc_RNA");
  });
});
