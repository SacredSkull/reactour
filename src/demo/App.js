import React, { Component, useState, useEffect, Suspense, lazy } from 'react'
import Tour from '../index'
import 'focus-outline-manager'
import { GlobalStyle } from './../style'
import Demo from './Demo'
import { Arrow } from '../index'
import Text from './Text'
import Glitch from './Glitch'
import Tooltip from './Tooltip'
import { Link } from './Button'
import PropTypes from 'prop-types'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

import './styles.css'

// const LazyTour = React.lazy(() =>
//   import(/* webpackChunkName: "reactour" */ '../index')
// )

function App() {
  const [isTourOpen, setOpen] = useState(false)
  const [isShowingMore, setShowingMore] = useState(false)
  const [customComps, setCustomComps] = useState(false)

  useEffect(() => {
    function keyHandling(e) {
      if (e.keyCode === 75) {
        e.preventDefault()
        setOpen(true)
      }

      if (isTourOpen && e.keyCode === 13) {
        e.preventDefault()
        setCustomComps(!customComps)
      }
    }
    window.addEventListener('keyup', keyHandling)
    return () => window.removeEventListener('keyup', keyHandling)
  }, [isTourOpen, customComps])

  const disableBody = target => disableBodyScroll(target)
  const enableBody = target => enableBodyScroll(target)
  const accentColor = '#5cb7b7'
  return (
    <>
      <GlobalStyle />
      <Demo
        openTour={() => setOpen(true)}
        toggleShowMore={() => setShowingMore(!isShowingMore)}
        isShowingMore={isShowingMore}
      />
      <Suspense fallback={<React.Fragment />}>
        <Tour
          onAfterOpen={disableBody}
          onBeforeClose={enableBody}
          onRequestClose={() => setOpen(false)}
          steps={tourConfig(setShowingMore)}
          isOpen={isTourOpen}
          maskClassName="mask"
          className="helper"
          rounded={5}
          accentColor={accentColor}
          CustomHelper={customComps ? MyCustomHelper : null}
        />
      </Suspense>
    </>
  )
}

function MyCustomHelper({ current, content, totalSteps, gotoStep, close }) {
  return (
    <main>
      <span
        style={{
          position: 'absolute',
          right: '1em',
          bottom: '.5em',
          fontSize: '10px',
        }}
      >
        Step: {current + 1} |{' '}
        <span style={{ cursor: 'pointer' }} onClick={close}>
          ❌
        </span>
        <hr style={{ border: 0, borderBottom: '1px solid rgba(0,0,0,.1)' }} />
        <Arrow
          onClick={() => gotoStep(current < totalSteps - 1 ? current + 1 : 0)}
          inverted={current < totalSteps - 1}
        />
      </span>

      {content}
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          listStyle: 'none',
        }}
      >
        {Array.from(Array(totalSteps).keys()).map((li, i) => (
          <li key={li}>
            <button
              onClick={() => current !== i && gotoStep(i)}
              style={{
                color: current === i ? 'red' : 'initial',
                border: 0,
                backgroundColor: '#f7f7f7',
                padding: '.5em',
                margin: '1px',
              }}
            >
              {li + 1}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

const tourConfig = (setShowingMoreHandler) => [
  {
    selector: '[data-tut="reactour__iso"]',
    content:
      "Ok, let's start with the name of the Tour that is about to begin.",
  },
  {
    selector: '[data-tut="reactour__logo"]',
    content: 'And this is our cool bus...',
  },
  {
    selector: '[data-tut="reactour__copy"]',
    content: `Keep in mind that you could try and test everything during the Tour.
      For example, try selecting the highlighted text…`,
  },
  {
    selector: '[data-tut="reactour__style"]',
    content: function DemoHelperComponent() {
      return (
        <div>
          <Glitch data-glitch="Styled">Styled</Glitch>
          <Text color="#e5e5e5">
            The <Tooltip data-tooltip="this helper ⬇">tourist guide</Tooltip>{' '}
            could be dressed in any way, using custom components, styles and so
            on…
          </Text>
          <Text color="#373737" size=".7em" style={{ marginTop: '.7em' }}>
            <Link
              href="http://codepen.io/lbebber/full/ypgql/"
              color="dark"
              nospaces
            >
              Text effect
            </Link>{' '}
            by{' '}
            <Link href="https://twitter.com/lucasbebber" color="dark" nospaces>
              Lucas Bebber
            </Link>
          </Text>
        </div>
      )
    },
    style: {
      backgroundColor: 'black',
      color: 'white',
    },
  },
  {
    selector: '[data-tut="reactour__goTo"]',
    content: function DemoHelperComponent({ goTo }) {
      DemoHelperComponent.propTypes = {
        goTo: PropTypes.func.isRequired,
      }

      return (
        <div>
          If you wanna go anywhere, skipping places, it is absolutely possible.
          <br />
          &quot;Oh, I forgot something inside the bus&hellip;&quot;{' '}
          <button
            style={{
              border: '1px solid #f7f7f7',
              background: 'none',
              padding: '.3em .7em',
              fontSize: 'inherit',
              display: 'block',
              cursor: 'pointer',
              margin: '1em auto',
            }}
            onClick={() => goTo(1)}
          >
            Please go back to 🚌
          </button>
        </div>
      )
    },
  },
  {
    selector: '[data-tut="reactour__position"]',
    content: function DemoHelperComponent() {
      return (
        <Text>
          The <Tooltip data-tooltip="this helper ⬇">tourist guide</Tooltip>{' '}
          could be positioned where you want.
          <br />
          In this case will try to stay in the <strong>left side</strong> if
          there is available space, otherwise will{' '}
          <strong>auto position</strong>.
        </Text>
      )
    },
    position: 'left',
  },
  {
    selector: '[data-tut="reactour__scroll"]',
    content:
      'Probably you noted that the Tour scrolled directly to the desired place, and you could control the time also…',
  },
  {
    selector: '[data-tut="reactour__scroll--hidden"]',
    content: 'Also when places are pretty hidden…',
  },
  {
    selector: '[data-tut="reactour__action"]',
    content:
      'As soon as you arrive on a step you can perform actions, like… (look at the console)',
    preAction: () =>
        console.log(`
                             [PRE-ACTION]
           This handler executes just before the step starts to begin,
              making it a good place to setup for this step.

                      ----------🕒-🕒-----------
              You can even perform actions in between steps,
      e.g. making sure a dropdown is open before the next step loads...
                      ----------🕒-🕒-----------
        `),
    action: () =>
          console.log(`
                               [ACTION]
        This handler executes when the step/dialog has fully landed
              on the selector and displayed 'step.content'.

                      -----------🏠🏚----------
          🚌 Arrived to explore these beautiful buildings! 🚌
                      -----------🏠🏚----------
       🚧 This action could also fire a method in your Component 🚧
        `),
    postAction: () =>
        console.log(`
                            [POST-ACTION]
        This handler executes just before moving on to the next step
        and should generally be used for cleanup of the current step.

                      ----------🕒-🕒-----------
            ...or the dropdown is closed for the next one,
          Whichever makes the most semantic sense is up to you!
                      ----------🕒-🕒-----------
        `),
  },
  {
    selector: '[data-tut="reactour__state"]',
    content:
      'And the Tour could be observing changes to update the view, try clicking the button…',
    observe: '[data-tut="reactour__state--observe"]',
    action: node => node.focus(),
    rewindAction: () => {
      setShowingMoreHandler(false)
      console.log("🕒 Timewarp in progress... 🕒")
    }
  },
  {
    selector: '[data-tut="reactour__state"]',
    content:
      'Whoops - we\'ve made a change to the page\'s state... If we go backwards the tour might be depend on the buildings being hidden! See what happens when you rewind this step.',
  },
]

export default App
