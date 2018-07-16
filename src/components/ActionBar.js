import React from 'react'
import PropTypes from 'prop-types'

import './actionbar.less'

function ActionBar (props) {
  return (
    <div className="action-bar">
      <h2 className="page-title action-bar-text">🐶</h2>
      <p className="action-bar-text resource-name">{props.resourceName}</p>
      {props.hasChange
        ? <p className="save-status action-bar-text">Unsaved Changes</p>
        : (props.translated ? <p className="save-status action-bar-text">All changes saved on {props.lastSaved}</p> : <p className="save-status action-bar-text">Not yet translated</p>)
      }
      <button className="button save action-bar-text" onClick={props.handleSave}>Save</button>
      <label className="action-bar-text">Mark as complete
        <input type="checkbox" checked={props.markedAsComplete} onChange={props.handleComplete} />
      </label>
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
  resourceName: PropTypes.string
}

export default ActionBar
