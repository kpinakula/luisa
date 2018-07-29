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
        {props.hasChange
          ? <p className="save-status title-bar-text">Unsaved Changes</p>
          : (props.translated ? <p className="save-status title-bar-text">All changes saved on {props.lastSaved}</p> : <p className="save-status title-bar-text">Not yet translated</p>)
        }
        <button className="button save title-bar-text" onClick={props.handleSave}>Save</button>
        <label className="title-bar-text">Mark as complete
          <input type="checkbox" checked={props.markedAsComplete} onChange={props.handleComplete} />
        </label>
      </div>
      <div className="options-bar">
        <div className="option">
          <ReactToggle
            defaultChecked
            onChange={props.toggleScrollSync}
            icons={false}
          />
          <p className="options-bar-text">Synchronized Scrolling</p>
        </div>
        <div className="option">
          <ReactToggle
            defaultChecked
            onChange={props.toggleAutoSave}
            icons={false}
          />
          <p className="options-bar-text">Auto-Save</p>
        </div>
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
  toggleScrollSync: PropTypes.func.isRequired,
  toggleAutoSave: PropTypes.func.isRequired
}

export default ActionBar
