import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from 'theme-patternfly-org/components';
import { css } from '@patternfly/react-styles';
import BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon';
import CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';
import imgBrand from '@patternfly/react-core/src/demos/examples/pfColorLogo.svg';
import imgAvatar from '@patternfly/react-core/src/components/Avatar/examples/avatarImg.svg';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import AttentionBellIcon from '@patternfly/react-icons/dist/esm/icons/attention-bell-icon';
import LightbulbIcon from '@patternfly/react-icons/dist/esm/icons/lightbulb-icon';
import srcImportdefaultnav from './react-demos/default-nav.png';
import srcImportexpandablenav from './react-demos/expandable-nav.png';
import srcImportgroupednav from './react-demos/grouped-nav.png';
import srcImporthorizontalnav from './react-demos/horizontal-nav.png';
import srcImportlegacylightnav from './react-demos/legacylight-nav.png';
import srcImportmanualnav from './react-demos/manual-nav.png';
import srcImportstickysectiongroupalternatesyntaxandusingpageheader from './react-demos/sticky-section-group-alternate-syntax-and-using-pageheader.png';
import srcImportstickysectiongroupalternatesyntax from './react-demos/sticky-section-group-alternate-syntax.png';
import srcImportstickysectiongroupusingpageheader from './react-demos/sticky-section-group-using-pageheader.png';
import srcImportstickysectiongroup from './react-demos/sticky-section-group.png';
import srcImporttertiarynav from './react-demos/tertiary-nav.png';
const pageData = {
  "id": "Page",
  "section": "components",
  "source": "react-demos",
  "slug": "/components/page/react-demos",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-core/src/demos/Page/Page.md",
  "fullscreenExamples": [
    "Sticky section group",
    "Sticky section group (using PageHeader)",
    "Sticky section group (alternate syntax and using PageHeader)"
  ]
};
pageData.liveContext = {
  css,
  BellIcon,
  CogIcon,
  HelpIcon,
  QuestionCircleIcon,
  imgBrand,
  imgAvatar,
  BarsIcon,
  AttentionBellIcon,
  LightbulbIcon
};
pageData.examples = {
  'Sticky section group': props => 
    <Example {...pageData} {...props} thumbnail={srcImportstickysectiongroup} {...{"code":"import React from 'react';\nimport {\n  Avatar,\n  Brand,\n  Breadcrumb,\n  BreadcrumbItem,\n  Button,\n  ButtonVariant,\n  Card,\n  CardBody,\n  Checkbox,\n  Divider,\n  Dropdown,\n  DropdownGroup,\n  DropdownToggle,\n  DropdownItem,\n  DropdownSeparator,\n  Gallery,\n  GalleryItem,\n  KebabToggle,\n  Masthead,\n  MastheadBrand,\n  MastheadContent,\n  MastheadMain,\n  MastheadToggle,\n  Nav,\n  NavItem,\n  NavList,\n  Page,\n  PageSection,\n  PageSectionVariants,\n  PageSidebar,\n  PageToggleButton,\n  SkipToContent,\n  TextContent,\n  Text,\n  Toolbar,\n  ToolbarContent,\n  ToolbarGroup,\n  ToolbarItem,\n  Drawer,\n  DrawerPanelContent,\n  DrawerContent,\n  DrawerContentBody,\n  DrawerHead,\n  DrawerActions,\n  DrawerCloseButton,\n} from '@patternfly/react-core';\nimport { css } from '@patternfly/react-styles';\nimport BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon';\nimport CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon';\nimport HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';\nimport QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';\nimport AttentionBellIcon from '@patternfly/react-icons/dist/esm/icons/attention-bell-icon';\nimport LightbulbIcon from '@patternfly/react-icons/dist/esm/icons/lightbulb-icon';\nimport BarsIcon from '@patternfly/react-icons/dist/js/icons/bars-icon';\nimport imgBrand from './imgBrand.svg';\nimport imgAvatar from './imgAvatar.svg';\n\nclass PageLayoutGrouped extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      isDropdownOpen: false,\n      isKebabDropdownOpen: false,\n      isFullKebabDropdownOpen: false,\n      activeItem: 0,\n      isDrawerExpanded: false\n    };\n    this.onDropdownToggle = isDropdownOpen => {\n      this.setState({\n        isDropdownOpen\n      });\n    };\n\n    this.onDropdownSelect = event => {\n      this.setState({\n        isDropdownOpen: !this.state.isDropdownOpen\n      });\n    };\n\n    this.onKebabDropdownToggle = isKebabDropdownOpen => {\n      this.setState({\n        isKebabDropdownOpen\n      });\n    };\n\n    this.onKebabDropdownSelect = event => {\n      this.setState({\n        isKebabDropdownOpen: !this.state.isKebabDropdownOpen\n      });\n    };\n\n    this.onNavSelect = result => {\n      this.setState({\n        activeItem: result.itemId\n      });\n    };\n\n    this.onFullKebabToggle = isFullKebabDropdownOpen => {\n      this.setState({\n        isFullKebabDropdownOpen\n      });\n    };\n\n    this.onFullKebabSelect = () => {\n      this.setState({\n        isFullKebabDropdownOpen: !this.state.isFullKebabDropdownOpen\n      });\n    };\n\n    this.onDrawerToggle = () => {\n      const isDrawerExpanded = !this.state.isDrawerExpanded;\n      this.setState({\n        isDrawerExpanded\n      });\n    };\n\n    this.onDrawerClose = () => {\n      this.setState({\n        isDrawerExpanded: false\n      });\n    };\n  }\n\n  render() {\n    const { isDropdownOpen, isKebabDropdownOpen, activeItem, isFullKebabDropdownOpen, isDrawerExpanded } = this.state;\n\n    const PageNav = (\n      <Nav variant=\"tertiary\" onSelect={this.onNavSelect} aria-label=\"Nav\">\n        <NavList>\n          <NavItem href=\"#\" itemId={0} isActive={activeItem === 0}>\n            System panel\n          </NavItem>\n          <NavItem href=\"#\" itemId={1} isActive={activeItem === 1}>\n            Policy\n          </NavItem>\n          <NavItem href=\"#\" itemId={2} isActive={activeItem === 2}>\n            Authentication\n          </NavItem>\n          <NavItem href=\"#\" itemId={3} isActive={activeItem === 3}>\n            Network services\n          </NavItem>\n          <NavItem href=\"#\" itemId={4} isActive={activeItem === 4}>\n            Server\n          </NavItem>\n        </NavList>\n      </Nav>\n    );\n\n    const kebabDropdownItems = [\n      <DropdownItem>\n        <CogIcon /> Settings\n      </DropdownItem>,\n      <DropdownItem>\n        <HelpIcon /> Help\n      </DropdownItem>\n    ];\n\n    const userDropdownItems = [\n      <DropdownGroup key=\"group 2\">\n        <DropdownItem key=\"group 2 profile\">My profile</DropdownItem>\n        <DropdownItem key=\"group 2 user\" component=\"button\">\n          User management\n        </DropdownItem>\n        <DropdownItem key=\"group 2 logout\">Logout</DropdownItem>\n      </DropdownGroup>\n    ];\n\n    const fullKebabItems = [\n      <DropdownGroup key=\"group 2\">\n        <DropdownItem key=\"group 2 profile\">My profile</DropdownItem>\n        <DropdownItem key=\"group 2 user\" component=\"button\">\n          User management\n        </DropdownItem>\n        <DropdownItem key=\"group 2 logout\">Logout</DropdownItem>\n      </DropdownGroup>,\n      <Divider key=\"divider\" />,\n      <DropdownItem key=\"kebab-1\">\n        <CogIcon /> Settings\n      </DropdownItem>,\n      <DropdownItem key=\"kebab-2\">\n        <HelpIcon /> Help\n      </DropdownItem>\n    ];\n\n    const headerToolbar = (\n      <Toolbar id=\"toolbar\" isFullHeight isStatic>\n        <ToolbarContent>\n          <ToolbarGroup\n            variant=\"icon-button-group\"\n            alignment={{ default: 'alignRight' }}\n            spacer={{ default: 'spacerNone', md: 'spacerMd' }}\n          >\n            <ToolbarItem>\n              <Button aria-label=\"Toggle drawer\" variant={ButtonVariant.plain} onClick={this.onDrawerToggle}>\n                <LightbulbIcon color={isDrawerExpanded ? 'yellow' : 'currentColor'} />\n              </Button>\n            </ToolbarItem>\n            <ToolbarItem>\n              <Button aria-label=\"Notifications\" variant={ButtonVariant.plain}>\n                <AttentionBellIcon />\n              </Button>\n            </ToolbarItem>\n            <ToolbarGroup variant=\"icon-button-group\" visibility={{ default: 'hidden', lg: 'visible' }}>\n              <ToolbarItem>\n                <Button aria-label=\"Settings actions\" variant={ButtonVariant.plain}>\n                  <CogIcon />\n                </Button>\n              </ToolbarItem>\n              <ToolbarItem>\n                <Button aria-label=\"Help actions\" variant={ButtonVariant.plain}>\n                  <QuestionCircleIcon />\n                </Button>\n              </ToolbarItem>\n            </ToolbarGroup>\n            <ToolbarItem visibility={{ default: 'hidden', md: 'visible', lg: 'hidden' }}>\n              <Dropdown\n                isPlain\n                position=\"right\"\n                onSelect={this.onKebabDropdownSelect}\n                toggle={<KebabToggle onToggle={this.onKebabDropdownToggle} />}\n                isOpen={isKebabDropdownOpen}\n                dropdownItems={kebabDropdownItems}\n              />\n            </ToolbarItem>\n            <ToolbarItem visibility={{ default: 'visible', md: 'hidden', lg: 'hidden', xl: 'hidden', '2xl': 'hidden' }}>\n              <Dropdown\n                isPlain\n                position=\"right\"\n                onSelect={this.onFullKebabSelect}\n                toggle={<KebabToggle onToggle={this.onFullKebabToggle} />}\n                isOpen={isFullKebabDropdownOpen}\n                dropdownItems={fullKebabItems}\n              />\n            </ToolbarItem>\n          </ToolbarGroup>\n          <ToolbarItem visibility={{ default: 'hidden', md: 'visible' }}>\n            <Dropdown\n              position=\"right\"\n              onSelect={this.onDropdownSelect}\n              isOpen={isDropdownOpen}\n              toggle={\n                <DropdownToggle icon={<Avatar src={imgAvatar} alt=\"Avatar\" />} onToggle={this.onDropdownToggle}>\n                  John Smith\n                </DropdownToggle>\n              }\n              dropdownItems={userDropdownItems}\n            />\n          </ToolbarItem>\n        </ToolbarContent>\n      </Toolbar>\n    );\n\n    const Header = (\n      <Masthead>\n        <MastheadToggle>\n          <PageToggleButton variant=\"plain\" aria-label=\"Global navigation\">\n            <BarsIcon />\n          </PageToggleButton>\n        </MastheadToggle>\n        <MastheadMain>\n          <MastheadBrand>\n            <Brand src={imgBrand} alt=\"Patternfly Logo\" />\n          </MastheadBrand>\n        </MastheadMain>\n        <MastheadContent>{headerToolbar}</MastheadContent>\n      </Masthead>\n    );\n\n    const pageId = 'main-content-page-layout-tertiary-nav';\n    const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>;\n\n    const PageBreadcrumb = (\n      <Breadcrumb>\n        <BreadcrumbItem>Section home</BreadcrumbItem>\n        <BreadcrumbItem to=\"#\">Section title</BreadcrumbItem>\n        <BreadcrumbItem to=\"#\">Section title</BreadcrumbItem>\n        <BreadcrumbItem to=\"#\" isActive>\n          Section landing\n        </BreadcrumbItem>\n      </Breadcrumb>\n    );\n\n    const panelContent = (\n      <DrawerPanelContent isResizable>\n        <DrawerHead>\n          <span tabIndex={isDrawerExpanded ? 0 : -1}>\n            drawer-panel\n          </span>\n          <DrawerActions>\n            <DrawerCloseButton onClick={this.onDrawerClose} />\n          </DrawerActions>\n        </DrawerHead>\n      </DrawerPanelContent>\n    );\n\n    const Sidebar = <PageSidebar nav=\"Navigation\" />;\n\n    return (\n      <Drawer isExpanded={isDrawerExpanded} isInline onExpand={this.onExpand}>\n        <DrawerContent panelContent={panelContent}>\n          <DrawerContentBody>\n            <Page\n              header={Header}\n              breadcrumb={PageBreadcrumb}\n              sidebar={Sidebar}\n              tertiaryNav={PageNav}\n              isManagedSidebar\n              isTertiaryNavWidthLimited\n              isBreadcrumbWidthLimited\n              skipToContent={PageSkipToContent}\n              mainContainerId={pageId}\n              isTertiaryNavGrouped\n              isBreadcrumbGrouped\n              additionalGroupedContent={\n                <PageSection variant={PageSectionVariants.light}>\n                  <TextContent>\n                    <Text component=\"h1\">Main title</Text>\n                    <Text component=\"p\">\n                      Body text should be Overpass Regular at 16px. It should have leading of 24px because <br />\n                      of its relative line height of 1.5.\n                    </Text>\n                  </TextContent>\n                </PageSection>\n              }\n              groupProps={{\n                sticky: 'top'\n              }}\n            >\n              <PageSection>\n                <Gallery hasGutter>\n                  {Array.apply(0, Array(20)).map((x, i) => (\n                    <GalleryItem key={i}>\n                      <Card>\n                        <CardBody>This is a card</CardBody>\n                      </Card>\n                    </GalleryItem>\n                  ))}\n                </Gallery>\n              </PageSection>\n            </Page>\n          </DrawerContentBody>\n        </DrawerContent>\n      </Drawer>\n    );\n  }\n}","title":"Sticky section group","lang":"js","isFullscreen":true}}>
      
    </Example>,
  'Sticky section group (using PageHeader)': props => 
    <Example {...pageData} {...props} thumbnail={srcImportstickysectiongroupusingpageheader} {...{"code":"import React from 'react';\nimport {\n  Avatar,\n  Brand,\n  Breadcrumb,\n  BreadcrumbItem,\n  Button,\n  ButtonVariant,\n  Card,\n  CardBody,\n  Dropdown,\n  DropdownGroup,\n  DropdownToggle,\n  DropdownItem,\n  DropdownSeparator,\n  Gallery,\n  GalleryItem,\n  KebabToggle,\n  Nav,\n  NavItem,\n  NavList,\n  Page,\n  PageHeader,\n  PageSection,\n  PageSectionVariants,\n  PageSidebar,\n  SkipToContent,\n  TextContent,\n  Text,\n  PageHeaderTools,\n  PageHeaderToolsGroup,\n  PageHeaderToolsItem\n} from '@patternfly/react-core';\nimport { css } from '@patternfly/react-styles';\nimport BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon';\nimport CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon';\nimport HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';\nimport QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';\nimport imgBrand from './imgBrand.svg';\nimport imgAvatar from './imgAvatar.svg';\n\nclass PageLayoutGrouped extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      isDropdownOpen: false,\n      isKebabDropdownOpen: false,\n      activeItem: 0\n    };\n    this.onDropdownToggle = isDropdownOpen => {\n      this.setState({\n        isDropdownOpen\n      });\n    };\n\n    this.onDropdownSelect = event => {\n      this.setState({\n        isDropdownOpen: !this.state.isDropdownOpen\n      });\n    };\n\n    this.onKebabDropdownToggle = isKebabDropdownOpen => {\n      this.setState({\n        isKebabDropdownOpen\n      });\n    };\n\n    this.onKebabDropdownSelect = event => {\n      this.setState({\n        isKebabDropdownOpen: !this.state.isKebabDropdownOpen\n      });\n    };\n\n    this.onNavSelect = result => {\n      this.setState({\n        activeItem: result.itemId\n      });\n    };\n  }\n\n  render() {\n    const { isDropdownOpen, isKebabDropdownOpen, activeItem } = this.state;\n\n    const PageNav = (\n      <Nav variant=\"tertiary\" onSelect={this.onNavSelect} aria-label=\"Nav\">\n        <NavList>\n          <NavItem href=\"#\" itemId={0} isActive={activeItem === 0}>\n            System panel\n          </NavItem>\n          <NavItem href=\"#\" itemId={1} isActive={activeItem === 1}>\n            Policy\n          </NavItem>\n          <NavItem href=\"#\" itemId={2} isActive={activeItem === 2}>\n            Authentication\n          </NavItem>\n          <NavItem href=\"#\" itemId={3} isActive={activeItem === 3}>\n            Network services\n          </NavItem>\n          <NavItem href=\"#\" itemId={4} isActive={activeItem === 4}>\n            Server\n          </NavItem>\n        </NavList>\n      </Nav>\n    );\n    const kebabDropdownItems = [\n      <DropdownItem>\n        <CogIcon /> Settings\n      </DropdownItem>,\n      <DropdownItem>\n        <HelpIcon /> Help\n      </DropdownItem>\n    ];\n    const userDropdownItems = [\n      <DropdownGroup key=\"group 2\">\n        <DropdownItem key=\"group 2 profile\">My profile</DropdownItem>\n        <DropdownItem key=\"group 2 user\" component=\"button\">\n          User management\n        </DropdownItem>\n        <DropdownItem key=\"group 2 logout\">Logout</DropdownItem>\n      </DropdownGroup>\n    ];\n    const headerTools = (\n      <PageHeaderTools>\n        <PageHeaderToolsGroup\n          visibility={{\n            default: 'hidden',\n            lg: 'visible'\n          }} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */\n        >\n          <PageHeaderToolsItem>\n            <Button aria-label=\"Settings actions\" variant={ButtonVariant.plain}>\n              <CogIcon />\n            </Button>\n          </PageHeaderToolsItem>\n          <PageHeaderToolsItem>\n            <Button aria-label=\"Help actions\" variant={ButtonVariant.plain}>\n              <QuestionCircleIcon />\n            </Button>\n          </PageHeaderToolsItem>\n        </PageHeaderToolsGroup>\n        <PageHeaderToolsGroup>\n          <PageHeaderToolsItem\n            visibility={{\n              lg: 'hidden'\n            }} /** this kebab dropdown replaces the icon buttons and is hidden for desktop sizes */\n          >\n            <Dropdown\n              isPlain\n              position=\"right\"\n              onSelect={this.onKebabDropdownSelect}\n              toggle={<KebabToggle onToggle={this.onKebabDropdownToggle} />}\n              isOpen={isKebabDropdownOpen}\n              dropdownItems={kebabDropdownItems}\n            />\n          </PageHeaderToolsItem>\n          <PageHeaderToolsItem\n            visibility={{ default: 'hidden', md: 'visible' }} /** this user dropdown is hidden on mobile sizes */\n          >\n            <Dropdown\n              isPlain\n              position=\"right\"\n              onSelect={this.onDropdownSelect}\n              isOpen={isDropdownOpen}\n              toggle={<DropdownToggle onToggle={this.onDropdownToggle}>John Smith</DropdownToggle>}\n              dropdownItems={userDropdownItems}\n            />\n          </PageHeaderToolsItem>\n        </PageHeaderToolsGroup>\n        <Avatar src={imgAvatar} alt=\"Avatar image\" />\n      </PageHeaderTools>\n    );\n\n    const Header = (\n      <PageHeader logo={<Brand src={imgBrand} alt=\"Patternfly Logo\" />} headerTools={headerTools} showNavToggle />\n    );\n    const pageId = 'main-content-page-layout-tertiary-nav';\n    const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>;\n\n    const PageBreadcrumb = (\n      <Breadcrumb>\n        <BreadcrumbItem>Section home</BreadcrumbItem>\n        <BreadcrumbItem to=\"#\">Section title</BreadcrumbItem>\n        <BreadcrumbItem to=\"#\">Section title</BreadcrumbItem>\n        <BreadcrumbItem to=\"#\" isActive>\n          Section landing\n        </BreadcrumbItem>\n      </Breadcrumb>\n    );\n\n    return (\n      <React.Fragment>\n        <Page\n          header={Header}\n          breadcrumb={PageBreadcrumb}\n          tertiaryNav={PageNav}\n          isManagedSidebar\n          isTertiaryNavWidthLimited\n          isBreadcrumbWidthLimited\n          skipToContent={PageSkipToContent}\n          mainContainerId={pageId}\n          isTertiaryNavGrouped\n          isBreadcrumbGrouped\n          additionalGroupedContent={\n            <PageSection variant={PageSectionVariants.light}>\n              <TextContent>\n                <Text component=\"h1\">Main title</Text>\n                <Text component=\"p\">\n                  Body text should be Overpass Regular at 16px. It should have leading of 24px because <br />\n                  of its relative line height of 1.5.\n                </Text>\n              </TextContent>\n            </PageSection>\n          }\n          groupProps={{\n            sticky: 'top'\n          }}\n        >\n          <PageSection>\n            <Gallery hasGutter>\n              {Array.apply(0, Array(20)).map((x, i) => (\n                <GalleryItem key={i}>\n                  <Card>\n                    <CardBody>This is a card</CardBody>\n                  </Card>\n                </GalleryItem>\n              ))}\n            </Gallery>\n          </PageSection>\n        </Page>\n      </React.Fragment>\n    );\n  }\n}","title":"Sticky section group (using PageHeader)","lang":"js","isFullscreen":true}}>
      
      <p {...{"className":"ws-p"}}>
        {`This demo is provided becuase PageHeader and PageHeaderTools are still in use; however, going forward Masthead and Toolbar should be used to make headers rather than PageHeader and PageHeaderTools.`}
      </p>
    </Example>,
  'Sticky section group (alternate syntax and using PageHeader)': props => 
    <Example {...pageData} {...props} thumbnail={srcImportstickysectiongroupalternatesyntaxandusingpageheader} {...{"code":"import React from 'react';\nimport {\n  Avatar,\n  Brand,\n  Breadcrumb,\n  BreadcrumbItem,\n  Button,\n  ButtonVariant,\n  Card,\n  CardBody,\n  Dropdown,\n  DropdownGroup,\n  DropdownToggle,\n  DropdownItem,\n  DropdownSeparator,\n  Gallery,\n  GalleryItem,\n  KebabToggle,\n  Nav,\n  NavItem,\n  NavList,\n  Page,\n  PageHeader,\n  PageSection,\n  PageSectionVariants,\n  PageSidebar,\n  PageGroup,\n  PageBreadcrumb,\n  PageNavigation,\n  SkipToContent,\n  TextContent,\n  Text,\n  PageHeaderTools,\n  PageHeaderToolsGroup,\n  PageHeaderToolsItem\n} from '@patternfly/react-core';\nimport { css } from '@patternfly/react-styles';\nimport BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon';\nimport CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon';\nimport HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';\nimport QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';\nimport imgBrand from './imgBrand.svg';\nimport imgAvatar from './imgAvatar.svg';\n\nclass PageLayoutGroupedAlt extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      isDropdownOpen: false,\n      isKebabDropdownOpen: false,\n      activeItem: 0\n    };\n    this.onDropdownToggle = isDropdownOpen => {\n      this.setState({\n        isDropdownOpen\n      });\n    };\n\n    this.onDropdownSelect = event => {\n      this.setState({\n        isDropdownOpen: !this.state.isDropdownOpen\n      });\n    };\n\n    this.onKebabDropdownToggle = isKebabDropdownOpen => {\n      this.setState({\n        isKebabDropdownOpen\n      });\n    };\n\n    this.onKebabDropdownSelect = event => {\n      this.setState({\n        isKebabDropdownOpen: !this.state.isKebabDropdownOpen\n      });\n    };\n\n    this.onNavSelect = result => {\n      this.setState({\n        activeItem: result.itemId\n      });\n    };\n  }\n\n  render() {\n    const { isDropdownOpen, isKebabDropdownOpen, activeItem } = this.state;\n\n    const kebabDropdownItems = [\n      <DropdownItem>\n        <CogIcon /> Settings\n      </DropdownItem>,\n      <DropdownItem>\n        <HelpIcon /> Help\n      </DropdownItem>\n    ];\n    const userDropdownItems = [\n      <DropdownGroup key=\"group 2\">\n        <DropdownItem key=\"group 2 profile\">My profile</DropdownItem>\n        <DropdownItem key=\"group 2 user\" component=\"button\">\n          User management\n        </DropdownItem>\n        <DropdownItem key=\"group 2 logout\">Logout</DropdownItem>\n      </DropdownGroup>\n    ];\n    const headerTools = (\n      <PageHeaderTools>\n        <PageHeaderToolsGroup\n          visibility={{\n            default: 'hidden',\n            lg: 'visible'\n          }} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */\n        >\n          <PageHeaderToolsItem>\n            <Button aria-label=\"Settings actions\" variant={ButtonVariant.plain}>\n              <CogIcon />\n            </Button>\n          </PageHeaderToolsItem>\n          <PageHeaderToolsItem>\n            <Button aria-label=\"Help actions\" variant={ButtonVariant.plain}>\n              <QuestionCircleIcon />\n            </Button>\n          </PageHeaderToolsItem>\n        </PageHeaderToolsGroup>\n        <PageHeaderToolsGroup>\n          <PageHeaderToolsItem\n            visibility={{\n              lg: 'hidden'\n            }} /** this kebab dropdown replaces the icon buttons and is hidden for desktop sizes */\n          >\n            <Dropdown\n              isPlain\n              position=\"right\"\n              onSelect={this.onKebabDropdownSelect}\n              toggle={<KebabToggle onToggle={this.onKebabDropdownToggle} />}\n              isOpen={isKebabDropdownOpen}\n              dropdownItems={kebabDropdownItems}\n            />\n          </PageHeaderToolsItem>\n          <PageHeaderToolsItem\n            visibility={{ default: 'hidden', md: 'visible' }} /** this user dropdown is hidden on mobile sizes */\n          >\n            <Dropdown\n              isPlain\n              position=\"right\"\n              onSelect={this.onDropdownSelect}\n              isOpen={isDropdownOpen}\n              toggle={<DropdownToggle onToggle={this.onDropdownToggle}>John Smith</DropdownToggle>}\n              dropdownItems={userDropdownItems}\n            />\n          </PageHeaderToolsItem>\n        </PageHeaderToolsGroup>\n        <Avatar src={imgAvatar} alt=\"Avatar image\" />\n      </PageHeaderTools>\n    );\n\n    const Header = (\n      <PageHeader logo={<Brand src={imgBrand} alt=\"Patternfly Logo\" />} headerTools={headerTools} showNavToggle />\n    );\n    const pageId = 'main-content-page-layout-tertiary-nav';\n    const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>;\n\n    return (\n      <React.Fragment>\n        <Page header={Header} isManagedSidebar skipToContent={PageSkipToContent} mainContainerId={pageId}>\n          <PageGroup sticky=\"top\">\n            <PageNavigation isWidthLimited>\n              <Nav variant=\"tertiary\" onSelect={this.onNavSelect} aria-label=\"Nav\">\n                <NavList>\n                  <NavItem href=\"#\" itemId={0} isActive={activeItem === 0}>\n                    System panel\n                  </NavItem>\n                  <NavItem href=\"#\" itemId={1} isActive={activeItem === 1}>\n                    Policy\n                  </NavItem>\n                  <NavItem href=\"#\" itemId={2} isActive={activeItem === 2}>\n                    Authentication\n                  </NavItem>\n                  <NavItem href=\"#\" itemId={3} isActive={activeItem === 3}>\n                    Network services\n                  </NavItem>\n                  <NavItem href=\"#\" itemId={4} isActive={activeItem === 4}>\n                    Server\n                  </NavItem>\n                </NavList>\n              </Nav>\n            </PageNavigation>\n            <PageBreadcrumb>\n              <Breadcrumb>\n                <BreadcrumbItem>Section home</BreadcrumbItem>\n                <BreadcrumbItem to=\"#\">Section title</BreadcrumbItem>\n                <BreadcrumbItem to=\"#\">Section title</BreadcrumbItem>\n                <BreadcrumbItem to=\"#\" isActive>\n                  Section landing\n                </BreadcrumbItem>\n              </Breadcrumb>\n            </PageBreadcrumb>\n            <PageSection variant={PageSectionVariants.light}>\n              <TextContent>\n                <Text component=\"h1\">Main title</Text>\n                <Text component=\"p\">\n                  Body text should be Overpass Regular at 16px. It should have leading of 24px because <br />\n                  of its relative line height of 1.5.\n                </Text>\n              </TextContent>\n            </PageSection>{' '}\n          </PageGroup>\n          <PageSection>\n            <Gallery hasGutter>\n              {Array.apply(0, Array(20)).map((x, i) => (\n                <GalleryItem key={i}>\n                  <Card>\n                    <CardBody>This is a card</CardBody>\n                  </Card>\n                </GalleryItem>\n              ))}\n            </Gallery>\n          </PageSection>\n        </Page>\n      </React.Fragment>\n    );\n  }\n}","title":"Sticky section group (alternate syntax and using PageHeader)","lang":"js","isFullscreen":true}}>
      
      <p {...{"className":"ws-p"}}>
        {`Please see `}
                <a href="#sticky-section-group-using-pageheader">{`this`}</a>
        {` note regarding PageHeader.`}
      </p>
    </Example>
};

const Component = () => (
  <React.Fragment>
    <ul {...{"className":"ws-ul"}}>
      <li {...{"className":"ws-li"}}>
        <p {...{"className":"ws-p"}}>
          {`All but the last example set the `}
          <code {...{"className":"ws-code"}}>
            {`isManagedSidebar`}
          </code>
          {` prop on the Page component to have the sidebar automatically close for smaller screen widths. You can also manually control this behavior by not adding the `}
          <code {...{"className":"ws-code"}}>
            {`isManagedSidebar`}
          </code>
          {` prop and instead:`}
        </p>
        <ol {...{"className":"ws-ol"}}>
          <li {...{"className":"ws-li"}}>
            {`Add an onNavToggle callback to PageHeader`}
          </li>
          <li {...{"className":"ws-li"}}>
            {`Pass a boolean into the isNavOpen prop to PageSidebar`}
          </li>
        </ol>
        <p {...{"className":"ws-p"}}>
          {`The last example demonstrates this.`}
        </p>
      </li>
      <li {...{"className":"ws-li"}}>
        <p {...{"className":"ws-p"}}>
          {`To make the page take up the full height, it is recommended to set the height of all ancestor elements up to the page component to `}
          <code {...{"className":"ws-code"}}>
            {`100%`}
          </code>
        </p>
      </li>
    </ul>
    <AutoLinkHeader {...{"id":"layouts","size":"h2","className":"ws-title ws-h2"}}>
      {`Layouts`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`This demonstrates a variety of navigation patterns in the context of a full page layout. These can be used as a basis for choosing the most appropriate page template for your application.`}
    </p>
    {React.createElement(pageData.examples["Sticky section group"])}
    {React.createElement(pageData.examples["Sticky section group (using PageHeader)"])}
    {React.createElement(pageData.examples["Sticky section group (alternate syntax and using PageHeader)"])}
  </React.Fragment>
);
Component.displayName = 'ComponentsPageReactDemosDocs';
Component.pageData = pageData;

export default Component;
