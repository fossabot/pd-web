import { Loader, Dropdown, Icon, Menu, MenuItemProps, Button, DropdownProps } from 'semantic-ui-react'
import React, { Component } from 'react'

export interface IKeyVisToolBarProps {
  isLoading: boolean
  isAutoFetch: boolean
  isOnBrush: boolean
  metricType: string
  brightLevel: number
  dateRange: number
  onResetZoom: () => void
  onToggleBrush: () => void
  onChangeMetric: (string) => void
  onToggleAutoFetch: any
  onChangeDateRange: (number) => void
  onChangeBrightLevel: (number) => void
}

export default class KeyVisToolBar extends Component<IKeyVisToolBarProps> {
  handleAutoFetch = (_, { name }: MenuItemProps) => {
    this.props.onToggleAutoFetch()
  }

  handleDateRange = (e, { value }: DropdownProps) => {
    this.props.onChangeDateRange(value)
  }

  handleMetricChange = (e, { value }: DropdownProps) => {
    this.props.onChangeMetric(value)
  }

  handleBrightLevelChange = (type: 'up' | 'down' | 'reset') => {
    let newBrightLevel
    switch (type) {
      case 'up':
        newBrightLevel = this.props.brightLevel * 2
        break
      case 'down':
        newBrightLevel = this.props.brightLevel / 2
        break
      case 'reset':
        newBrightLevel = 1
        break
    }
    this.props.onChangeBrightLevel(newBrightLevel)
  }

  render() {
    const { isAutoFetch, dateRange, isOnBrush, metricType } = this.props
    const DateRagneOptions = [
      {
        key: 0,
        text: '1 Hour',
        value: 3600 * 1
      },
      {
        key: 1,
        text: '12 Hours',
        value: 3600 * 12
      },
      { key: 2, text: '1 Day', value: 3600 * 24 },
      { key: 3, text: '7 Days', value: 3600 * 24 * 7 }
    ]

    const MetricOptions = [
      { text: 'Read Bytes', value: 'read_bytes' },
      {
        text: 'Write Bytes',
        value: 'written_bytes'
      },
      { text: 'Read Keys', value: 'read_keys' },
      { text: 'Write Keys', value: 'written_keys' },
      { text: 'All', value: 'integration' }
    ]

    // isAutoFetch = this.props.isAutoFetch

    return (
      <>
        <Menu icon="labeled" size="small" compact text fluid className="PD-KeyVis-Toolbar">
          <Menu.Menu position="right">
            <Menu.Item name="loading">
              <Loader active={this.props.isLoading} inline />
            </Menu.Item>

            <Menu.Item>
              <Button.Group basic className="group-icons-btn">
                <Button
                  icon="minus"
                  className={this.props.brightLevel < 1 / 64 ? 'disabled' : ''}
                  onClick={() => {
                    this.handleBrightLevelChange('down')
                  }}
                />
                <Button
                  icon="adjust"
                  onClick={() => {
                    this.handleBrightLevelChange('reset')
                  }}
                />
                <Button
                  icon="plus"
                  className={this.props.brightLevel > 64 ? 'disabled' : ''}
                  onClick={() => {
                    this.handleBrightLevelChange('up')
                  }}
                />
              </Button.Group>
              Set Brightness
            </Menu.Item>

            <Menu.Item name="resetZoom" onClick={this.props.onResetZoom}>
              <Icon name="zoom-out" />
              Reset Zoom
            </Menu.Item>

            <Menu.Item name="toogleBrush" color="green" onClick={this.props.onToggleBrush} active={isOnBrush}>
              <Icon name="zoom-in" />
              Zoom In
            </Menu.Item>

            <Menu.Item name="autoUpdate" color="green" active={isAutoFetch} onClick={this.handleAutoFetch}>
              <Icon name="refresh" />
              Auto Update
            </Menu.Item>

            <Menu.Item>
              <Icon name="clock outline" />

              <Dropdown
                placeholder="Quick range"
                onChange={this.handleDateRange}
                options={DateRagneOptions}
                value={dateRange}
              ></Dropdown>
            </Menu.Item>

            <Menu.Item>
              <Icon name="chart area" />
              <Dropdown
                placeholder="Metric"
                onChange={this.handleMetricChange}
                options={MetricOptions}
                value={metricType}
              ></Dropdown>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </>
    )
  }
}
