import React, { Component } from 'react';
import './ReactiveTable.css';

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
      itemsPerPage: 6,
      currentPage: 1
    }
  }

  sortData = (key) => {
    let tmpData = this.state.currentDataSet;
    let type = this.props.columnNames.find(item => item.key == key)["type"];
    switch(type){
      case "number":
        tmpData.sort((a, b) => (a.age - b.age))
        break;
      case "string":
        tmpData.sort((a, b) => a["name"].localeCompare(b["name"]))
        break;
      case "date":
        tmpData.sort((a, b) => (a.date - b.date))
        break;
      default:
        alert("This should never happen XD");
    }
    this.setState({sortedDataSet: tmpData});
    this.paginateData(); 
  }

  paginateData = () => {
    let indexOfLastItem = this.state.currentPage * this.state.itemsPerPage;
    let indexOfFirstItem = indexOfLastItem - this.state.itemsPerPage;
    let tmpData = this.state.sortedDataSet.slice(indexOfFirstItem, indexOfLastItem);
    this.setState({paginatedDataSet: tmpData});
  }

  goToNextPage = () => {
    if(this.state.currentPage < (this.state.sortedDataSet.length / this.state.itemsPerPage))
      this.setState({currentPage: this.state.currentPage + 1});
    this.paginateData();
  }

  goToPreviousPage = () => {
    if(this.state.currentPage > 1)
      this.setState({currentPage: this.state.currentPage - 1});
    this.paginateData();
  }

  filterData = (keyword) => {
    this.setState({filteredDataSet: this.state.filteredDataSet.filter((keyword, index) => this.props.allDataSet.lastIndexOf(keyword) === index)});
  }


  componentDidMount () {
    this.sortData(this.props.defaultSortParam);
    this.paginateData();
  }

  render() {

    return (
      <div className="wrapper">
        <table className="items">
          <thead>
            <tr>{this.props.columnNames.map(item => <th>{item.label}</th>)}</tr>
          </thead>
          <tbody>
            {this.state.paginatedDataSet.map(item => <ReactiveTableItem data={item}
              columnNames={this.props.columnNames} />)}
            <tr>{this.props.columnNames.map(item => <input type="text" placeholder="Filter column" onChange={() => {this.filterData("a")}}></input>)}</tr>
          </tbody>
        </table>
        <button onClick={() => {this.sortData("name")}}>Sortuj imiona</button>
        <button onClick={() => {this.sortData("age")}}>Sortuj wiek</button>
        <button onClick={this.goToNextPage}>Next page</button>
        <button onClick={this.goToPreviousPage}>Previous page</button>
      </div> 
    );
  }
}

export default ReactiveTable;
