import { Component, type ReactNode } from 'react';

export interface SVGPathObject {
  path: string;
  className?: string;
}

export interface IconDefinitionBase {
  name?: string;
  width: number;
  height: number;
  xOffset?: number;
  yOffset?: number;
  svgClassName?: string;
}

/**
 * SVG path content for one icon variant (default or rh-ui). At runtime at least one of
 * `svgPathData` or `svgPath` must be set; if both are present, `svgPathData` is used.
 */
export interface IconDefinition extends IconDefinitionBase {
  svgPathData?: string | SVGPathObject[];
  /**
   * @deprecated Use {@link IconDefinition.svgPathData} instead.
   */
  svgPath?: string | SVGPathObject[];
}

/** Narrows {@link IconDefinition} to the preferred shape with required `svgPathData`. */
export type IconDefinitionWithSvgPathData = Required<Pick<IconDefinition, 'svgPathData'>> & IconDefinition;

/**
 * @deprecated Use {@link IconDefinition} with `svgPathData` instead.
 * Narrows {@link IconDefinition} to the legacy shape with required `svgPath`.
 */
export type IconDefinitionWithSvgPath = Required<Pick<IconDefinition, 'svgPath'>> & IconDefinition;

/**
 * Props for {@link createIconBase} — nested icon definition(s). Used by generated icons and callers
 * that already structure data as `{ icon, rhUiIcon? }`.
 */
export interface CreateIconBaseProps {
  name?: string;
  icon: IconDefinition;
  rhUiIcon?: IconDefinition | null;
}

/**
 * @deprecated Use {@link CreateIconBaseProps} instead.
 */
export type CreateIconProps = CreateIconBaseProps;

/**
 * The **flat (legacy) public API** for {@link createIcon}: the same path/view fields as
 * {@link IconDefinition} at the top level, plus optional `rhUiIcon` for the dual-`set` layout.
 * `createIcon` is the only entry that accepts this shape; it maps to {@link CreateIconBaseProps} and calls
 * {@link createIconBase} (see {@link createIcon}).
 */
export interface CreateIconLegacyProps {
  name?: string;
  width: number;
  height: number;
  xOffset?: number;
  yOffset?: number;
  svgPathData?: string | SVGPathObject[];
  /**
   * @deprecated Use {@link CreateIconLegacyProps.svgPathData} instead.
   */
  svgPath?: string | SVGPathObject[];
  svgClassName?: string;
  /**
   * Optional second variant for the `set="rh-ui"` / nested-inner-SVG layout, matching {@link createIconBase}.
   */
  rhUiIcon?: IconDefinition | null;
}

export interface SVGIconProps extends Omit<React.HTMLProps<SVGElement>, 'ref'> {
  title?: string;
  className?: string;
  /** Indicates the icon should render using alternate svg data for the unified theme */
  set?: 'default' | 'rh-ui';
  /** Indicates the icon should render without its default styling specified in its IconDefinition.svgClassName. */
  noDefaultStyle?: boolean;
}

let currentId = 0;

/** Returns path data from `svgPathData` or deprecated `svgPath` (prefers `svgPathData` when both exist). */
function resolveSvgPathData(icon: IconDefinition): string | SVGPathObject[] {
  if ('svgPathData' in icon && icon.svgPathData !== undefined) {
    return icon.svgPathData;
  }
  if ('svgPath' in icon && icon.svgPath !== undefined) {
    return icon.svgPath;
  }
  throw new Error('@patternfly/react-icons: IconDefinition must define svgPathData or svgPath');
}

/** Produces a single {@link IconDefinitionWithSvgPathData} for internal rendering. */
function normalizeIconDefinition(icon: IconDefinition): IconDefinitionWithSvgPathData {
  return {
    name: icon.name,
    width: icon.width,
    height: icon.height,
    svgPathData: resolveSvgPathData(icon),
    xOffset: icon.xOffset,
    yOffset: icon.yOffset,
    svgClassName: icon.svgClassName
  };
}

/** Renders <path> element(s) from resolved (normalized) path data. */
function pathElementsFromResolvedData(svgPathData: string | SVGPathObject[]): ReactNode {
  return Array.isArray(svgPathData) ? (
    svgPathData.map((pathObject, index) => (
      <path className={pathObject.className} key={`${pathObject.path}-${index}`} d={pathObject.path} />
    ))
  ) : (
    <path d={svgPathData} />
  );
}

/** Renders an inner `<svg>` with viewBox and path(s) for the dual-SVG (CSS swap) layout. */
const createSvg = (icon: IconDefinitionWithSvgPathData, iconClassName: string) => {
  const { xOffset, yOffset, width, height, svgPathData, svgClassName } = icon;
  const _xOffset = xOffset ?? 0;
  const _yOffset = yOffset ?? 0;
  const viewBox = [_xOffset, _yOffset, width, height].join(' ');

  const classNames: string[] = [];

  if (svgClassName) {
    classNames.push(svgClassName);
  }
  if (iconClassName) {
    classNames.push(iconClassName);
  }

  return (
    <svg viewBox={viewBox} className={classNames.join(' ')}>
      {pathElementsFromResolvedData(svgPathData)}
    </svg>
  );
};

/**
 * Preferred factory for **nested** icon config (`icon` and optional `rhUiIcon`). Package-generated icons use this.
 *
 * @param name Optional display name for the component; falls back to `icon.name` when not set.
 * @see {@link createIcon} for the legacy **flat** argument shape.
 */
export function createIconBase({
  name,
  icon,
  rhUiIcon = null
}: CreateIconBaseProps): React.ComponentClass<SVGIconProps> {
  if (icon == null) {
    const label = name != null ? ` (name: ${String(name)})` : '';
    throw new Error(`@patternfly/react-icons: createIconBase requires an \`icon\` definition${label}.`);
  }
  const normalizedIcon = normalizeIconDefinition(icon);
  const normalizedRhUiIcon = rhUiIcon != null ? normalizeIconDefinition(rhUiIcon) : null;
  const displayName = name ?? icon.name;

  return class SVGIcon extends Component<SVGIconProps> {
    static displayName = displayName;

    id = `icon-title-${currentId++}`;

    private warnedMissingRhUi = false;

    static defaultProps: SVGIconProps = {
      noDefaultStyle: false
    };

    private warnIfMissingRhUiMapping = () => {
      if (this.warnedMissingRhUi) {
        return;
      }
      if (this.props.set === 'rh-ui' && normalizedRhUiIcon === null) {
        this.warnedMissingRhUi = true;
        // eslint-disable-next-line no-console -- intentional dev-facing warning for invalid set/rh-ui pairing
        console.warn(
          `Set "rh-ui" was provided for ${displayName}, but no rh-ui icon data exists for this icon. The default icon will be rendered.`
        );
      }
    };

    componentDidMount() {
      this.warnIfMissingRhUiMapping();
    }

    componentDidUpdate() {
      this.warnIfMissingRhUiMapping();
    }

    /** Renders one root `<svg>`; either a single variant or nested inner SVGs for RH UI swap. */
    render() {
      const { title, className: propsClassName, set, noDefaultStyle, ...props } = this.props;

      const hasTitle = Boolean(title);
      const classNames = ['pf-v6-svg'];

      if (propsClassName) {
        classNames.push(propsClassName);
      }

      if (set !== undefined || normalizedRhUiIcon === null) {
        const iconData: IconDefinitionWithSvgPathData =
          set === 'rh-ui' && normalizedRhUiIcon !== null ? normalizedRhUiIcon : normalizedIcon;
        const { xOffset, yOffset, width, height, svgPathData, svgClassName } = iconData;
        const _xOffset = xOffset ?? 0;
        const _yOffset = yOffset ?? 0;
        const viewBox = [_xOffset, _yOffset, width, height].join(' ');

        if (svgClassName && !noDefaultStyle) {
          classNames.push(svgClassName);
        }

        const svgPaths = pathElementsFromResolvedData(svgPathData);

        return (
          <svg
            className={classNames.join(' ')}
            fill="currentColor"
            viewBox={viewBox}
            aria-labelledby={hasTitle ? this.id : null}
            aria-hidden={hasTitle ? null : true}
            role="img"
            width="1em"
            height="1em"
            {...(props as Omit<React.SVGProps<SVGElement>, 'ref'>)} // Lie.
          >
            {hasTitle && <title id={this.id}>{title}</title>}
            {svgPaths}
          </svg>
        );
      }
      return (
        <svg
          className={classNames.join(' ')}
          fill="currentColor"
          aria-labelledby={hasTitle ? this.id : null}
          aria-hidden={hasTitle ? null : true}
          role="img"
          width="1em"
          height="1em"
          {...(props as Omit<React.SVGProps<SVGElement>, 'ref'>)} // Lie.
        >
          {hasTitle && <title id={this.id}>{title}</title>}
          {createSvg(normalizedIcon, 'pf-v6-icon-default')}
          {normalizedRhUiIcon && createSvg(normalizedRhUiIcon, 'pf-v6-icon-rh-ui')}
        </svg>
      );
    }
  };
}

/**
 * Legacy **flat** factory: maps {@link CreateIconLegacyProps} to {@link CreateIconBaseProps} and calls
 * {@link createIconBase} (all remapping lives here; `createIconBase` only implements rendering). For the
 * nested `icon` / `rhUiIcon` shape, use {@link createIconBase} directly.
 */
export function createIcon(legacy: CreateIconLegacyProps): React.ComponentClass<SVGIconProps> {
  const { rhUiIcon = null, ...iconFields } = legacy;
  const icon: IconDefinition = iconFields;
  return createIconBase({ name: icon.name, icon, rhUiIcon });
}
