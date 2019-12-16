import { Loader, Dropdown, Icon, Menu, MenuItemProps, Button, DropdownProps } from 'semantic-ui-react'
import React, { Component } from 'react'

export interface IKeyVisToolBarProps {
  isLoading: boolean
  isAutoFetch: boolean
  onChangeMetric: (string) => void
  onToggleAutoFetch: (boolean) => void
  onChangeDateRange: (number) => void
  onAdjustBright: (string) => void
}

export default class KeyVisToolBar extends Component<IKeyVisToolBarProps> {
  state = {
    activeItem: 'auto_update',
    metricType: 'write_bytes',
    isAutoFetch: true,
    dateRange: 1000 * 3600 * 12
  }

  handleZoom = () => {}

  handleAutoFetch = (_, { name }: MenuItemProps) => {
    const isAutoFetch = !this.state.isAutoFetch
    this.setState({ isAutoFetch })
    this.props.onToggleAutoFetch(isAutoFetch)
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
    const { isAutoFetch } = this.state
    const DateRagneOptions = [
      {
        key: 0,
        text: '1 Hour',
        value: 1000 * 3600 * 1
      },
      {
        key: 1,
        text: '12 Hours',
        value: 1000 * 3600 * 12
      },
      { key: 2, text: '1 Day', value: 1000 * 3600 * 24 },
      { key: 3, text: '7 Days', value: 1000 * 3600 * 24 * 7 }
    ]

    const MetricOptions = [
      {
        text: 'Write Bytes',
        value: 'write_bytes'
      },
      { text: 'Read Bytes', value: 'read_bytes' },
      { text: 'All Bytes', value: 'aa' }
    ]

    // isAutoFetch = this.props.isAutoFetch

    return (
      <>
        <Loader active={this.props.isLoading} inline />
        <Menu icon="labeled" size="small" compact text fluid>
          <Menu.Menu position="right">
            <Menu.Item>
              <Button.Group basic>
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
            </Menu.Item>

            <Menu.Item name="resetZoom" onClick={this.handleZoom}>
              <Icon name="zoom-out" />
              Reset Zoom
            </Menu.Item>

            <Menu.Item name="autoUpdate" color="green" active={isAutoFetch} onClick={this.handleAutoFetch}>
              <Icon name="refresh" />
              Auto Update
            </Menu.Item>

            <Menu.Item>
              <Icon name="clock outline" />
              {/* Date Range */}
              {/* <DateRange /> */}
              <Dropdown
                placeholder="Quick range"
                onChange={this.handleDateRange}
                options={DateRagneOptions}
                value={this.state.dateRange}
              ></Dropdown>
            </Menu.Item>

            <Menu.Item>
              <Icon name="chart area" />
              <Dropdown
                placeholder="Metric"
                onChange={this.handleMetricChange}
                options={MetricOptions}
                value={this.state.metricType}
              ></Dropdown>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </>
    )
  }
}
