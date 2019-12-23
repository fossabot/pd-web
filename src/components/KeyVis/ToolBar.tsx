import { Loader, Dropdown, Icon, Menu, MenuItemProps, Button, DropdownProps } from 'semantic-ui-react'
import React, { Component } from 'react'

export interface IKeyVisToolBarProps {
  isLoading: boolean
  isAutoFetch: boolean
  isOnBrush: boolean
  metricType: string
  dateRange: number
  onResetZoom: () => void
  onToggleBrush: () => void
  onChangeMetric: (string) => void
  onToggleAutoFetch: any
  onChangeDateRange: (number) => void
  onAdjustBright: (string) => void
}

export default class KeyVisToolBar extends Component<IKeyVisToolBarProps> {
  handleAutoFetch = (_, { name }: MenuItemProps) => {
    this.props.onToggleAutoFetch()
  }

  handleDateRange = (e, { value }: DropdownProps) => {
    this.setState({ dateRange: value })
    this.props.onChangeDateRange(value)
  }

  handleMetricChange = (e, { value }: DropdownProps) => {
    this.setState({ metricType: value })
    this.props.onChangeMetric(value)
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
      {
        text: 'Write Bytes',
        value: 'written_bytes'
      },
      { text: 'Read Bytes', value: 'read_bytes' },
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
                  onClick={() => {
                    this.props.onAdjustBright('down')
                  }}
                />
                <Button
                  icon="adjust"
                  onClick={() => {
                    this.props.onAdjustBright('reset')
                  }}
                />
                <Button
                  icon="plus"
                  onClick={() => {
                    this.props.onAdjustBright('up')
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
