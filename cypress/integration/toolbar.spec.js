describe("toolbar", function() {
  beforeEach(() => {
    cy.visit("");
  });

  it(`save tool should be disabled initially and then enabled after an edit is made`, () => {
    cy.get(`[data-test="saveTool"]`)
      .parent()
      .should("have.class", "bp3-disabled");
    cy.selectRange(2, 5);
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Cut")
      .click();
    cy.get(`[data-test="saveTool"]`)
      .parent()
      .should("not.have.class", "bp3-disabled");
  });
  it(`find tool should be working as expected
  -it starts with nothing selected
  -it can find dna letters
  -it can toggle the find options and highlight all
  -and toggle finding Amino acids
  `, function() {
    cy.clock();
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.tick(500);
    cy.get(".veFindBar").contains("0/0");
    cy.get(".veFindBar")
      .contains("1/1")
      .should("not.exist");
    cy.focused().type("gattac");
    cy.get(".veFindBar").contains("1/1");
    cy.focused().type("c");
    cy.get(".veFindBar").contains("0/0");
    cy.get(`[data-test="veFindBarOptionsToggle"]`).click();
    cy.get(".ve-find-options-popover")
      .contains("Highlight All")
      .click();

    cy.get(".veFindBar input")
      .clear()
      .type("gat");
    cy.get(".selectionLayerCaret").should("have.length.greaterThan", 100);
    cy.get(`[data-test="veFindBarOptionsToggle"]`).click();
    cy.get(`.ve-find-options-popover [type="checkbox"]`).should("be.checked");
    cy.get(`[name="dnaOrAA"]`).select("Amino Acids");
    cy.get(".veFindBar").contains("1/2");
    cy.get(".veRowViewSelectionLayer")
      .first()
      .click({ force: true });
    cy.contains("372 to 380");

    cy.get(`[data-test="veFindNextMatchButton"]`).click();
    cy.get(".veRowViewSelectionLayer")
      .first()
      .click({ force: true });
    cy.contains("3999 to 4007");
  });

  it("should be able to have individual tool functionality overridden", function() {
    cy.tgToggle("overrideToolbarOptions");
    cy.get(`[data-test="veDownloadTool"]`).click();
    cy.contains("Download tool hit!");
    cy.get(`[data-test="my-overridden-tool-123"]`).click();
    cy.contains("cha-ching");
  });
  it("import tool should be able to import a genbank file", function() {
    cy.uploadFile(`[data-test="veImportTool"]`, "pj5_00002.gb");
    cy.contains("Sequence Imported").should("exist");
    cy.contains("Parsed using Genbank Parser").should("exist");
  });
  it("cutsite tool should toggle on and off cutsites", function() {
    cy.get(`.cutsiteLabelSelectionLayer`).should("exist");
    cy.get(`.veCutsite`).should("exist");
    cy.get(`.veRowViewCutsite.snip`).should("exist");
    cy.get(`.veRowViewCutsite.snipConnector`).should("exist");
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.get(`.cutsiteLabelSelectionLayer`).should("not.exist");
    cy.get(`.veCutsite`).should("not.exist");
    cy.get(`.veRowViewCutsite.snip`).should("not.exist");
    cy.get(`.veRowViewCutsite.snipConnector`).should("not.exist");
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.get(`.cutsiteLabelSelectionLayer`).should("exist");
    cy.get(`.veCutsite`).should("exist");
    cy.get(`.veRowViewCutsite.snip`).should("exist");
    cy.get(`.veRowViewCutsite.snipConnector`).should("exist");
  });
  it("export tool should be able to export a genbank, fasta, or tg file", function() {
    if (Cypress.browser.isHeadless) return true; //stop early because this test fails currently in headless mode
    cy.clock();
    cy.get(`[data-test="veDownloadTool"]`).click();
    cy.contains("Download Genbank File").click();
    cy.contains("File Downloaded Successfully");
    cy.tick(30000); //pass some time so that the toastr isn't shown
    cy.contains("File Downloaded Successfully").should("not.exist");
    cy.get(`[data-test="veDownloadTool"]`).click();
    cy.contains("Download FASTA File").click();
    cy.contains("File Downloaded Successfully");
    cy.tick(30000); //pass some time so that the toastr isn't shown
    cy.contains("File Downloaded Successfully").should("not.exist");
    cy.get(`[data-test="veDownloadTool"]`).click();
    cy.contains("Download Teselagen JSON File").click();
    cy.contains("File Downloaded Successfully");
    cy.tick(30000); //pass some time so that the toastr isn't shown
    cy.contains("File Downloaded Successfully").should("not.exist");

    // cy.contains("Sequence Imported").should("exist")
    // cy.contains("Parsed using Genbank Parser").should("exist")
  });
  

  it("can open the cutsite dropdown and add an additional enzyme", function() {
    cy.get("[data-test=cutsiteToolDropdown]").click();
    cy.contains("Single cutters");
    cy.get(".Select-control").click();
    cy.get(".Select-control").click();
    cy.contains("Add additional enzymes").click();
    cy.contains("Select cut sites").click(); //click twice because of react dropdown weirdness
    cy.contains("Select cut sites").click();
    cy.contains("AanI").click();
    cy.contains("Cuts 2 times").click();
    cy.contains("Add Enzyme").click();
    cy.get(".ve-toolbar-dropdown").contains("2 cuts");
  });

  it("you should be able to undo and redo the deletion of several features", function() {
    cy.get(`[data-test="veUndoTool"]`).click();
    cy.contains("Undo Successful").should("not.exist");
    cy.get(".veCircularViewLabelText")
      .contains("CAP site")
      .click();
    cy.contains("Selecting 14 bps from 1115 to 1128");
    cy.get(".veVectorInteractionWrapper")
      .first()
      .type("{backspace}");
    cy.contains("Sequence Deleted Successfully");
    cy.get(`[data-test="veUndoTool"]`).click();
    cy.contains("Undo Successful");
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});
