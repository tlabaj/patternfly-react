describe('Accordion Demo Test', () => {
  it('Navigate to demo section', () => {
    cy.visit('http://localhost:3000/accordion-demo-nav-link');
  });

  it('Is not focusable when isFixed is false and content would overflow', () => {
    cy.get('#divAccordion-item1-toggle').click();
    cy.get('#divAccordion-item1-content').should('not.have.attr', 'tabindex');
    cy.get('#divAccordion-item1-content').click();
    cy.get('#divAccordion-item1-content').should('not.have.focus');
  });

  it('Is not focusable when isFixed is true and content does not overflow', () => {
    cy.get('#divAccordion-item2-toggle').click();
    cy.get('#divAccordion-item2-content').should('not.have.attr', 'tabindex');
    cy.get('#divAccordion-item2-content').click();
    cy.get('#divAccordion-item2-content').should('not.have.focus');
  });

  it('Is focusable when isFixed is true and content overflows', () => {
    cy.get('#divAccordion-item3-toggle').click();
    cy.get('#divAccordion-item3-content').should('have.attr', 'tabindex', '0');
    cy.get('#divAccordion-item3-content').click();
    cy.get('#divAccordion-item3-content').should('have.focus');
  });

  it('Role attribute is applied correctly', () => {
    cy.get('#divAccordion-item3-content').should('have.attr', 'role', 'region');
    cy.get('#definitionListAccordion-item1-content').should('not.have.attr', 'role');
  });

  it('in glass theme, does not apply glass plain transparent background when pf-m-no-plain-on-glass is present (even with pf-m-plain)', () => {
    cy.visit('http://localhost:3000/accordion-demo-nav-link');
    cy.document().then((doc) => {
      doc.documentElement.classList.add('pf-v6-theme-glass');
    });

    cy.get('[data-testid="accordion-glass-plain-both"]')
      .should('have.class', 'pf-m-no-plain-on-glass')
      .and('have.class', 'pf-m-plain');

    /**
     * This test fails due to a css bug.
     */
    cy.get('[data-testid="accordion-glass-plain-both"]').then(($el) => {
      const el = $el[0];
      const win = el.ownerDocument.defaultView;
      if (!win) {
        throw new Error('expected window');
      }
      const bg = win.getComputedStyle(el).backgroundColor;
      expect(bg).not.to.match(/rgba\(0,\s*0,\s*0,\s*0\)|transparent/);
    });
  });
});
