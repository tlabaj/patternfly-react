describe('Drawer Demo Test', () => {
  afterEach(() => {
    cy.document().then((doc) => {
      doc.documentElement.classList.remove('pf-v6-theme-glass');
    });
  });

  it('Navigate to the drawer demo', () => {
    cy.visit('http://localhost:3000/drawer-demo-nav-link');
  });

  // Known PatternFly CSS bug: when `pf-v6-theme-glass`, `pf-m-glass` (isGlass), and `pf-m-plain` are all active,
  // `pf-m-no-plain-on-glass` does not take effect — plain-under-glass wins and no-plain-on-glass cannot restore
  // the intended glass panel treatment. This test asserts the corrected outcome (semi-transparent background)
  // and fails until Core CSS fixes selector/specificity for that combination.
  it('glass theme + plain + glass: no-plain-on-glass should yield semi-transparent panel background (fails until CSS fix)', () => {
    cy.document().then((doc) => {
      doc.documentElement.classList.add('pf-v6-theme-glass');
    });
    cy.get('html').should('have.class', 'pf-v6-theme-glass');

    cy.get('#drawer-panel-glass-plain-combo.pf-v6-c-drawer__panel')
      .should('be.visible')
      .should('have.class', 'pf-m-glass')
      .and('have.class', 'pf-m-plain')
      .and('have.class', 'pf-m-no-plain-on-glass');

    cy.get('#drawer-panel-glass-plain-combo').within(() => {
      cy.contains('Glass theme plain / no-plain-on-glass combo');
    });

    // When the bug is fixed, no-plain-on-glass should override plain-under-glass and surface a non-opaque background.
    cy.get('#drawer-panel-glass-plain-combo').should(($el) => {
      const bg = window.getComputedStyle($el[0]).backgroundColor;

      const rgbaAlpha = (color: string): number | undefined => {
        if (color === 'transparent') {
          return 0;
        }
        if (!color.startsWith('rgba(') || !color.endsWith(')')) {
          return undefined;
        }
        const inner = color.slice('rgba('.length, -1);
        const parts = inner.split(',').map((p) => p.trim());
        if (parts.length !== 4) {
          return undefined;
        }
        return parseFloat(parts[3]);
      };

      const alpha = rgbaAlpha(bg);
      const hasSemiTransparentBackground = alpha !== undefined && alpha < 1;
      if (!hasSemiTransparentBackground) {
        throw new Error(
          `expected no-plain-on-glass to win over plain+glass under theme (semi-transparent background, alpha < 1); got backgroundColor=${bg}`
        );
      }
    });
  });

  it('Verify focus is automatically handled with focus trap enabled', () => {
    cy.get('#toggleFocusTrapButton').click();
    cy.get('#focusTrap-panelContent .pf-v6-c-button.pf-m-plain').should('have.focus');
    cy.get('#focusTrap-panelContent .pf-v6-c-button.pf-m-plain').click();
    cy.get('#toggleFocusTrapButton').should('have.focus');
  });

  it('Verify focus can be customized with focus trap enabled', () => {
    cy.get('#toggleCustomFocusButton').click();
    // Wait for transition animation to end
    cy.wait(500);
    cy.get('#customFocus-panelContent').should('have.focus');
    cy.get('#toggleCustomFocusButton').click();
  });

  it('Verify text in content', () => {
    const drawerContent =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pretium est a porttitor vehicula. Quisque vel commodo urna. Morbi mattis rutrum ante, id vehicula ex accumsan ut. Morbi viverra, eros vel porttitor facilisis, eros purus aliquet erat,nec lobortis felis elit pulvinar sem. Vivamus vulputate, risus eget commodo eleifend, eros nibh porta quam, vitae lacinia leo libero at magna. Maecenas aliquam sagittis orci, et posuere nisi ultrices sit amet. Aliquam ex odio, malesuada sed posuere quis, pellentesque at mauris. Phasellus venenatis massa ex, eget pulvinar libero auctor pretium. Aliquam erat volutpat. Duis euismod justo in quam ullamcorper, in commodo massa vulputate.';

    cy.get('#basic-drawer.pf-v6-c-drawer').contains(drawerContent);
  });

  it('Verify drawer expands and collapses', () => {
    cy.get('#basic-drawer.pf-v6-c-drawer').should('not.have.class', 'pf-m-expanded');
    cy.get('#toggleButton').click();
    cy.get('#basic-drawer.pf-v6-c-drawer').should('have.class', 'pf-m-expanded');
    cy.get('#toggleButton').click();
  });

  it('Verify bottom drawer with background variant', () => {
    cy.get('#basic-drawer.pf-v6-c-drawer').should('have.class', 'pf-m-panel-bottom');
    cy.get('#basic-drawer .pf-v6-c-drawer__panel').should('have.class', 'pf-m-secondary');
  });

  it('Verify panel widths', () => {
    // Large viewport
    const $drawerPanel = cy.get('#basic-drawer .pf-v6-c-drawer__panel');
    $drawerPanel.should('have.class', 'pf-m-width-100');
    $drawerPanel.should('have.class', 'pf-m-width-50-on-lg');
    $drawerPanel.should('have.class', 'pf-m-width-33-on-xl');
    $drawerPanel.should('have.class', 'pf-m-width-25-on-2xl');
    $drawerPanel.should('have.css', 'flex-basis', 'max(24px, min(300px, 100%))');
    // Medium viewport
    cy.viewport(800, 660);
    cy.get('#basic-drawer .pf-v6-c-drawer__panel').should('have.css', 'flex-basis', 'max(24px, min(100% + 0px, 100%))');
    // Xl viewport
    cy.viewport(1200, 660);
    cy.get('#basic-drawer .pf-v6-c-drawer__panel').should('have.css', 'flex-basis', 'max(24px, min(300px, 100%))');
    // 2Xl viewport
    cy.viewport(1450, 660);
    cy.get('#basic-drawer .pf-v6-c-drawer__panel').should('have.css', 'flex-basis', 'max(24px, min(300px, 100%))');
  });

  it('Verify that focus gets sent to drawer', () => {
    cy.get('#toggleButton').click();
    cy.wrap(() => cy.focused().contains('drawer-panel in demo with onExpand'), { timeout: 1000 });
  });
});
