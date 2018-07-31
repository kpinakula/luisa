import React from 'react'
import PropTypes from 'prop-types'
import ReactToggle from 'react-toggle'

import 'react-toggle/style.css'
import './actionbar.less'

function ActionBar (props) {
  return (
    <div className="action-bar">
      <div className={props.markedAsComplete ? 'title-bar complete' : 'title-bar'}>
        <h2 className="page-title title-bar-text">🐶</h2>
        <p className="title-bar-text resource-name">{props.resourceName}</p>
        <button
          className="button title-bar-text save"
          disabled={!props.hasChange}
          onClick={props.handleSave}
        >
          Save
        </button>
        <button
          className={`button title-bar-text ${props.markedAsComplete ? 'completed' : 'incomplete'}`}
          onClick={props.handleComplete}
          disabled={(!props.translated && !props.hasChange)}
        >
          <span className="check-mark">✔</span>{props.markedAsComplete ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
      <div className="options-bar">
        <div className="option">
          <ReactToggle
            checked={props.scrollSyncEnabled}
            onChange={props.toggleScrollSync}
            icons={false}
          />
          <p className="option-label">Synchronized Scrolling</p>
        </div>
        <div className="option">
          <ReactToggle
            checked={props.autoSaveEnabled}
            onChange={props.toggleAutoSave}
            icons={false}
          />
          <p className="option-label">Auto-Save</p>
        </div>
        <p className="save-status">
          {props.hasChange
            ? 'Unsaved changes'
            : props.translated
              ? `All changes saved on ${props.lastSaved}`
              : 'Not yet translated'
          }
        </p>
      </div>
    </div>
  )
}

ActionBar.propTypes = {
  handleSave: PropTypes.func.isRequired,
  markedAsComplete: PropTypes.bool,
  handleComplete: PropTypes.func.isRequired,
  hasChange: PropTypes.bool,
  lastSaved: PropTypes.instanceOf(Date),
  translated: PropTypes.bool,
  resourceName: PropTypes.string,
  scrollSyncEnabled: PropTypes.bool.isRequired,
  autoSaveEnabled: PropTypes.bool.isRequired,
  toggleScrollSync: PropTypes.func.isRequired,
  toggleAutoSave: PropTypes.func.isRequired
}

export default ActionBar
