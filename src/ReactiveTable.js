import React, { Component } from 'react';
import './css/ReactiveTable.css';

const ReactiveTableItem = (props) => {
  return <tr>{props.columnNames.map(item => <td>{props.data[item.key]}</td>)}</tr>
}

class ReactiveTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDataSet: this.props.allDataSet,
      filteredDataSet: this.props.allDataSet,
      sortedDataSet: this.props.allDataSet,
      paginatedDataSet: [],
      itemsPerPage: 10,
      currentPage: 1,
      sortDirection: 'descending',
      sortedColumn: this.props.defaultSortParam,
      filteredColumnChange: ''
    }
  }

  toggleSortDirection = (direction) => {
    if (direction === "ascending") return "descending"
    return "ascending"
  }

  filterData = (key, event) => {
    let tmpData;
    if(this.state.filteredColumnChange === '' || this.state.filteredColumnChange === key){
      tmpData = this.state.currentDataSet;
    } else{
      tmpData = this.state.filteredDataSet;
    }
    tmpData = tmpData.filter((item) => {
        if(item[key].toLowerCase().includes(event.target.value)) {
          return  item[key];
        }
    });
    this.setState({filteredColumn: key});
    this.setState({filteredDataSet: tmpData});
    this.setState({sortedDataSet: tmpData});
    this.paginateData();
  }

  sortData = (key, isFirstSort) => {
    let tmpData = this.state.filteredDataSet;
    let newSortDirection = this.state.sortedColumn === key ? this.toggleSortDirection(this.state.sortDirection) : "ascending";
    let type = this.props.columnNames.find(item => item.key == key)["type"];
    switch (type) {
      case "number":
        if (newSortDirection === 'ascending' || isFirstSort) {
          tmpData.sort((a, b) => (a[key] - b[key]));
        }
        else {
          if (this.state.sortedColumn !== key) {
            tmpData.sort((a, b) => (a[key] - b[key]));
          } else {
            tmpData.reverse();
          }
        }
        break;
      case "string":
        if (newSortDirection === 'ascending' || isFirstSort) {
          tmpData.sort((a, b) => a[key].localeCompare(b[key]));
        }
        else {
          if (this.state.sortedColumn !== key) {
            tmpData.sort((a, b) => a[key].localeCompare(b[key]));
          } else {
            tmpData.reverse();
          }
        }
        break;
      case "date":
        if (newSortDirection === 'ascending') {
          tmpData.sort((a, b) => (a.unix_date - b.unix_date));
        }
        else {
          tmpData.reverse();
        }
        break;
      default:
        alert("Type was not recognized");
    }
    this.setState({sortDirection: newSortDirection})
    this.setState({ sortedColumn: key });
    this.setState({ sortedDataSet: tmpData });
    this.paginateData();
  }

  paginateData = () => {
    this.setState((prevState) => {
      let indexOfLastItem = prevState.currentPage * prevState.itemsPerPage;
      let indexOfFirstItem = indexOfLastItem - prevState.itemsPerPage;
      let tmpData = prevState.sortedDataSet.slice(indexOfFirstItem, indexOfLastItem);
      return ({ paginatedDataSet: tmpData });
    })
  }

  goToNextPage = () => {
    if (this.state.currentPage < (this.state.sortedDataSet.length / this.state.itemsPerPage))
      this.setState({ currentPage: this.state.currentPage + 1 });
    this.paginateData();
  }

  goToPreviousPage = () => {
    if (this.state.currentPage > 1)
      this.setState({ currentPage: this.state.currentPage - 1 });
    this.paginateData();
  }

  componentDidMount() {
    if (this.props.defaultSortParam) {
      this.sortData(this.props.defaultSortParam, true);
    }
    this.paginateData();
  }

  getArrow = (direction) => {
    if (direction == "ascending")
      return <i className="fa fa-arrow-up" />
    else
      return <i className="fa fa-arrow-down" />
  }

  render() {

    return (
      <div className="wrapper">
        <table className={this.props.defaultStyle && this.props.defaultStyle.table}>
          <thead className={this.props.defaultStyle && this.props.defaultStyle.thead}>
            <tr>{this.props.columnNames.map((item, index) => <th onClick={() => { this.sortData(item.key, false) }}>
              {item.label}{this.state.sortedColumn == item.key && this.getArrow(this.state.sortDirection)}</th>)}</tr>
          </thead>
          <tfoot className={this.props.defaultStyle && this.props.defaultStyle.tbody}>
            <tr>{this.props.columnNames.map((item, index) => <th><input  style={{display: 'table', width: '80%', display: 'flex'}} onChange={(event) => {this.filterData(item.key, event)}}></input></th>)}</tr>
          </tfoot>
          <tbody className={this.props.defaultStyle && this.props.defaultStyle.tbody}>
            {this.state.paginatedDataSet.map(item => <ReactiveTableItem data={item}
              columnNames={this.props.columnNames} />)}
          </tbody>
        </table>
        <button onClick={this.goToPreviousPage}>Previous page</button>
        <button onClick={this.goToNextPage}>Next page</button>
      </div>
    );
  }
}

export default ReactiveTable;
