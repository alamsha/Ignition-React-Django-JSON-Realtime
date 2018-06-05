import React from 'react'
import { Bar } from 'react-chartjs-2'
import axios from 'axios'
import ReactSpeedometer from 'react-d3-speedometer'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import paginationFactory from '../packages/react-bootstrap-table2-paginator'
import filterFactory, {
  textFilter,
  Comparator
} from '../packages/react-bootstrap-table2-filter'
import PropTypes from 'prop-types'
import shuffle from 'shuffle-array'
import { Column, Row } from 'simple-flexbox'
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import logo1 from '../logo-react.svg'
import logo2 from '../ignition.jpg'
import logo3 from '../django2.png'

const btns = {
  position: 'relative',
  bottom: '7%'
}
const btn = {
  backgroundColor: '#ffffff',
  color: '#000000',
  borderColor: '#DEB887',
  borderRadius: '0.4em',
  cursor: 'pointer',
  margin: '0 1em',
  padding: '0.5em',
  display: 'inline-block'
}

const columns = [
  {
    dataField: 'id',
    text: 'id',
    filter: textFilter(),
    sort: true
  },
  {
    dataField: 'time',
    text: 'time',
    filter: textFilter(),
    sort: true
  },
  {
    dataField: 'intvalue',
    text: 'intvalue',
    filter: textFilter(),
    sort: true
  }
]

const RemoteAll = ({ data, page, sizePerPage, onTableChange, totalSize }) => (
  <div>
    <BootstrapTable
      remote={{ pagination: true }}
      keyField='id'
      data={data}
      columns={columns}
      filter={filterFactory()}
      pagination={paginationFactory({ page, sizePerPage, totalSize })}
      onTableChange={onTableChange}
    />
  </div>
)

RemoteAll.propTypes = {
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  totalSize: PropTypes.number.isRequired,
  sizePerPage: PropTypes.number.isRequired,
  onTableChange: PropTypes.func.isRequired
}

class DataVisualizer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 0,
      data: [],
      data1: [],

      // totalSize: data.length,
      sizePerPage: 5
    }

    this.handleTableChange = this.handleTableChange.bind(this)
  }

  loadData = async data2 => {
    // console.log('data loaded!')

    try {
      // const res = await axios('http://localhost:8000/lgniton_django_app1/')
      const res = await axios('https://api.myjson.com/bins/1ak7li')

      // shuffle data to simulate Realtime effect
      const data = shuffle(res.data)
      const data1 = shuffle(res.data)

      // don't shuffle, if you get Realtime data
      // const data = res.data
      // const data1 = res.data

      this.setState({
        data,
        data1
      })
    } catch (e) {
      console.log(e)
    }
  }

  handleChange (event) {
    // console.log(event.target.checked)

    event.target.checked
      ? (this.interval = setInterval(() => {
          // autoPlay some for specific period of times or
          // Do some stuff you want
        this.loadData(this.state.data)
      }, 2000))
      : clearInterval(this.interval)

    // console.log('out')
  }

  componentDidMount () {
    // load Ignition data
    this.loadData(this.state.data)
  }
  // }

  handleTableChange = (type, { page, sizePerPage, filters }) => {
    console.log('entered')
    clearInterval(this.interval)
    
    const currentIndex = (page - 1) * sizePerPage
    setTimeout(() => {
      const result = this.state.data1.filter(row => {
        let valid = true
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField]

          if (filterType === 'TEXT') {
            if (comparator === Comparator.LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1
            } else {
              valid = row[dataField] === filterVal
            }
          }
          if (!valid) break
        }
        return valid
      })
      this.setState(() => ({
        page,
        data: result.slice(currentIndex, currentIndex + sizePerPage),
        totalSize: result.length,
        sizePerPage
      }))
    }, 100)
  }

  render () {
    const { data, sizePerPage, page } = this.state

    const chartData = {
      labels: this.state.data.map(k => k.time),
      // labels: data.map(k => k.cat3),

      datasets: [
        {
          label: 'Data',
          data: this.state.data.map(d => d.intvalue),
          backgroundColor: 'green',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)'
        }
      ]
    }

    // console.log(this.state.data[0]) // false
    let is_valid_value = this.state.data[0] !== undefined
    // console.log(this.state.data) // false

    if (!is_valid_value || this.state.data[0] > 100) {
      return (
        <div className='Header'>
          <Column flexGrow={1}>
            <div className='App-header'>
              <h2>Ignition-ReactJS-Django-JSON Realtime</h2>
              <h6>Tango with Django!!! ----- by R.Alamsha</h6>
              <img src={logo1} className='App-logo1' alt='logo' />
              <img src={logo2} className='App-logo2' alt='logo' />
              <img src={logo3} className='App-logo3' alt='logo' />
            </div>
          </Column>

          <Row horizontal='center'>
            <div className='App3'>
              <ReactSpeedometer
                value={150}
                minValue={0}
                maxValue={100}
                currentValueText={'Invalid / Out of range'}
              />
            </div>

            <div className='App1'>
              <Bar data={chartData} />

              <div style={btns} className='buttons'>
                <button
                  style={btn}
                  type='button'
                  name='reset_btn'
                  id='reset_btn'
                  onClick={this.loadData.bind(this)}
                >
                  Reset
                </button>

              </div>
            </div>

            <div className='App2'>
              <RemoteAll
                data={data}
                page={page}
                sizePerPage={sizePerPage}
                totalSize={this.state.data1.length}
                onTableChange={this.handleTableChange}
              />
            </div>
          </Row>

        </div>
      )
    } else {
      return (
        <div className='Header'>
          <Column flexGrow={1}>
            <div className='App-header'>
              <h2>Ignition-ReactJS-Django-JSON Realtime</h2>
              <h6>Tango with Django!!! ----- by R.Alamsha</h6>
              <img src={logo1} className='App-logo1' alt='logo' />
              <img src={logo2} className='App-logo2' alt='logo' />
              <img src={logo3} className='App-logo3' alt='logo' />
            </div>
          </Column>

          <Row horizontal='center'>
            <div className='App3'>
              <ReactSpeedometer
                maxValue={100}
                value={this.state.data[0].intvalue}
                needleTransitionDuration={4000}
                needleTransition='easeElastic'
              />
            </div>

            <div className='App1'>
              <Bar data={chartData} />

              <div className='buttons'>

                <Toggle
                  defaultChecked={this.state.eggsAreReady}
                  aria-label='No label tag'
                  onChange={this.handleChange.bind(this)}
                />
                <span>Realtime</span>

                <button
                  style={btn}
                  type='button'
                  name='reset_btn'
                  id='reset_btn'
                  onClick={this.loadData.bind(this)}
                >
                  Get Historical Data
                </button>

              </div>

            </div>

            <div className='App2'>
              <RemoteAll
                data={data}
                page={page}
                sizePerPage={sizePerPage}
                totalSize={this.state.data1.length}
                onTableChange={this.handleTableChange}
              />
            </div>
          </Row>

        </div>
      )
    }
  }
}

export default DataVisualizer
