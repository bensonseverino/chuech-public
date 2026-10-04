import { Children, type ReactNode } from 'react'

type CrossfadeStackProps = {
  activeIndex: number
  /** One child per slide; all are stacked in the same grid cell. */
  children: ReactNode
  className?: string
}

/**
 * Swaps content in place with an opacity crossfade (latest-work spec §4).
 * Every child shares one grid cell, so the stack is always as tall as the
 * tallest child and nothing below it moves when the active item changes.
 * Inactive items are `hidden` + `inert` (visibility flips only after the fade).
 */
export default function CrossfadeStack({
  activeIndex,
  children,
  className = '',
}: CrossfadeStackProps) {
  return (
    <div className={`grid ${className}`}>
      {Children.toArray(children).map((child, idx) => {
        const active = idx === activeIndex
        return (
          <div
            key={idx}
            className="col-start-1 row-start-1"
            style={{
              opacity: active ? 1 : 0,
              visibility: active ? 'visible' : 'hidden',
              transition: active
                ? 'opacity var(--default-transition-duration) var(--default-transition-timing-function), visibility 0s'
                : 'opacity var(--default-transition-duration) var(--default-transition-timing-function), visibility 0s linear var(--default-transition-duration)',
            }}
            aria-hidden={!active}
            inert={!active}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
