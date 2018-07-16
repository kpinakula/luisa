import React from 'react'
import PropTypes from 'prop-types'

import './actionbar.less'

function ActionBar (props) {
  return (
    <div className="action-bar">
      {props.hasChange
        ? <p className="save-status">Unsaved Changes</p>
        : (props.translated ? <p className="save-status">All changes saved on {props.lastSaved}</p> : <p className="save-status">Not yet translated</p>)
      }
      <button className="button save" onClick={props.handleSave}>Save</button>
      <label>Mark as complete
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
  translated: PropTypes.bool
}

export default ActionBar
