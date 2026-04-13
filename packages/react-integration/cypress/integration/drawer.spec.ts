describe('Drawer Demo Test', () => {
  afterEach(() => {
    cy.document().then((doc) => {
      doc.documentElement.classList.remove('pf-v6-theme-glass');
    });
  });

  it('Navigate to the drawer demo', () => {
    cy.visit('http://localhost:3000/drawer-demo-nav-link');
  });

  it('glass theme + plain + glass: panel shows glass treatment (transparent bg and/or backdrop-filter)', () => {
    // Self-contained: do not rely on test order; other specs leave the page in various states.
    cy.visit('http://localhost:3000/drawer-demo-nav-link');
    cy.viewport(1280, 800);

    cy.document().then((doc) => {
      doc.documentElement.classList.add('pf-v6-theme-glass');
    });
    cy.get('html').should('have.class', 'pf-v6-theme-glass');

    cy.get('#drawer-glass-plain-combo.pf-v6-c-drawer').should('have.class', 'pf-m-expanded');

    cy.get('[data-testid="drawer-glass-plain-panel"]').should(($el) => {
      expect($el, 'glass plain combo panel').to.have.length(1);
      expect($el).to.not.have.attr('hidden');
      expect($el).to.not.have.attr('inert');
      expect($el).to.have.class('pf-m-glass');
      expect($el).to.have.class('pf-m-plain');
      expect($el).to.have.class('pf-m-no-plain-on-glass');
      expect($el).to.contain.text('Glass theme plain / no-plain-on-glass combo');
    });

    cy.get('[data-testid="drawer-glass-plain-panel"]').should(($el) => {
      const style = window.getComputedStyle($el[0]);
      const bg = style.backgroundColor;
      const backdrop = style.backdropFilter;

      const rgbaCommaAlpha = (color: string): number | undefined => {
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

      // e.g. rgb(255 255 255 / 0.08) from getComputedStyle in some engines
      const rgbSlashAlpha = (color: string): number | undefined => {
        if (!color.startsWith('rgb(')) {
          return undefined;
        }
        const slash = color.indexOf('/');
        const close = color.lastIndexOf(')');
        if (slash === -1 || close === -1 || slash >= close) {
          return undefined;
        }
        const a = parseFloat(color.slice(slash + 1, close).trim());
        return Number.isNaN(a) ? undefined : a;
      };

      const alpha = rgbaCommaAlpha(bg) ?? rgbSlashAlpha(bg);
      const hasSemiTransparentBackground = alpha !== undefined && alpha < 1;
      const hasBackdropBlur = Boolean(backdrop && backdrop !== 'none');

      if (!hasSemiTransparentBackground && !hasBackdropBlur) {
        throw new Error(
          `expected glass panel (semi-transparent background or backdrop-filter); got backgroundColor=${bg}, backdropFilter=${backdrop || ''}`
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
