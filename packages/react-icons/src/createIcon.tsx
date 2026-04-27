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
 * On-disk / nested icon data: `svgPathData` (preferred) or deprecated `svgPath` (at least one is required at
 * runtime for rendering; if both are set, `svgPathData` takes precedence when path data is resolved).
 */
export interface IconDefinition extends IconDefinitionBase {
  svgPathData?: string | SVGPathObject[];
  /**
   * @deprecated Use {@link IconDefinition.svgPathData} instead.
   */
  svgPath?: string | SVGPathObject[];
}

/**
 * Nested (current) public API: `{ icon, rhUiIcon?, name? }` as produced by the icon generator and
 * `createIconBase` consumers.
 */
export interface CreateIconBaseProps {
  name?: string;
  icon: IconDefinition;
  rhUiIcon?: IconDefinition | null;
}

/**
 * @deprecated Prefer {@link createIconBase} with a nested {@link IconDefinition} using `svgPathData` instead
 * of this flat `createIcon` shape and legacy `svgPath` field.
 */
export interface CreateIconProps {
  name?: string;
  width: number;
  height: number;
  xOffset?: number;
  yOffset?: number;
  svgPath?: string | SVGPathObject[];
  svgClassName?: string;
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

/** Renders the same path markup as the historical `createIcon` implementation. */
function getSvgPaths(svgPathData: string | SVGPathObject[] | undefined): ReactNode {
  return svgPathData && Array.isArray(svgPathData) ? (
    svgPathData.map((pathObject, index) => (
      <path className={pathObject.className} key={`${pathObject.path}-${index}`} d={pathObject.path} />
    ))
  ) : (
    <path d={svgPathData as string} />
  );
}

const createSvg = (icon: IconDefinition, iconClassName: string) => {
  const { xOffset, yOffset, width, height, svgPathData, svgPath, svgClassName } = icon ?? {};
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
      {getSvgPaths(svgPathData ?? svgPath)}
    </svg>
  );
};

/**
 * Factory for the nested / current icon API. Behavior matches the pre-split `createIcon` on `main` (this name
 * replaces the original export). For path mapping from the flat `svgPath` shape, use {@link createIcon} only.
 */
export function createIconBase({
  name,
  icon,
  rhUiIcon = null
}: CreateIconBaseProps): React.ComponentClass<SVGIconProps> {
  if (icon == null) {
    throw new Error(
      `@patternfly/react-icons: createIconBase requires an \`icon\` definition (name: ${name ?? 'unknown'}).`
    );
  }
  return class SVGIcon extends Component<SVGIconProps> {
    static displayName = name;

    id = `icon-title-${currentId++}`;

    static defaultProps: SVGIconProps = {
      noDefaultStyle: false
    };

    /** Renders one root `<svg>`; either a single variant or nested inner SVGs for RH UI swap. */
    render() {
      const { title, className: propsClassName, set, noDefaultStyle, ...props } = this.props;

      const hasTitle = Boolean(title);
      const classNames = ['pf-v6-svg'];

      if (propsClassName) {
        classNames.push(propsClassName);
      }

      if (set === 'rh-ui' && rhUiIcon === null) {
        // eslint-disable-next-line no-console -- same behavior as main branch createIcon
        console.warn(
          `Set "rh-ui" was provided for ${name}, but no rh-ui icon data exists for this icon. The default icon will be rendered.`
        );
      }

      if ((set === undefined && rhUiIcon === null) || set !== undefined) {
        const iconData = set !== undefined && set === 'rh-ui' && rhUiIcon !== null ? rhUiIcon : icon;
        const { xOffset, yOffset, width, height, svgPathData, svgPath, svgClassName } = iconData ?? {};
        const _xOffset = xOffset ?? 0;
        const _yOffset = yOffset ?? 0;
        const viewBox = [_xOffset, _yOffset, width, height].join(' ');

        if (svgClassName && !noDefaultStyle) {
          classNames.push(svgClassName);
        }

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
            {getSvgPaths(svgPathData ?? svgPath)}
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
          {icon && createSvg(icon, 'pf-v6-icon-default')}
          {rhUiIcon && createSvg(rhUiIcon, 'pf-v6-icon-rh-ui')}
        </svg>
      );
    }
  };
}

/**
 * Flat **legacy** entry point: turn {@link CreateIconProps} (`svgPath` + layout fields) into a nested
 * `icon: IconDefinition` with `svgPathData` set from `svgPath`, then call {@link createIconBase}. Use
 * {@link createIconBase} directly for nested `icon` objects that already use `svgPathData`.
 */
export function createIcon(legacy: CreateIconProps): React.ComponentClass<SVGIconProps> {
  const { rhUiIcon = null, ...flat } = legacy;
  const icon: IconDefinition = {
    name: flat.name,
    width: flat.width,
    height: flat.height,
    xOffset: flat.xOffset,
    yOffset: flat.yOffset,
    svgClassName: flat.svgClassName,
    svgPathData: flat.svgPath
  };
  return createIconBase({ name: icon.name, icon, rhUiIcon });
}
