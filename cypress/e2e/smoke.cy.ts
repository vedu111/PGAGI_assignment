describe('Smoke Flows', () => {
  it('loads home and toggles theme', () => {
    cy.visit('/');
    cy.get('header').should('exist');
    cy.get('button[aria-label="Toggle theme"]').click();
  });

  it('searches via header', () => {
    cy.visit('/');
    cy.get('input[placeholder="Search content..."]').type('AI{enter}');
    cy.url().should('include', '/search');
  });

  it('navigates to drag-drop demo', () => {
    cy.visit('/drag-drop-demo');
    cy.contains(/Drag & Drop/i).should('exist');
  });
});


