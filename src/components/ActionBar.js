import React from 'react'
import PropTypes from 'prop-types'

import './actionbar.less'

function ActionBar (props) {
  return (
    <div className="action-bar">
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
  handleComplete: PropTypes.func.isRequired
}

export default ActionBar
