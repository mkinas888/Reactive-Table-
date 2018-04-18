import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faArrowUp from '@fortawesome/fontawesome-free-solid/faArrowUp';
import faArrowDown from '@fortawesome/fontawesome-free-solid/faArrowDown';
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
      currentPage: 1,
      sortDirection: 'ascending',
      sortedColumn: this.props.defaultSortParam,
      isArrowUpHidden: [true, true],
      isArrowDownHidden: [true, true],
    }
  }

  sortData = (key, isFirstSort) => {
    let tmpData = this.state.currentDataSet;
    let type = this.props.columnNames.find(item => item.key == key)["type"];
    switch (type) {
      case "number":
        if (this.state.sortDirection === 'descending' || isFirstSort) {
          tmpData.sort((a, b) => (a.age - b.age));
          this.setState({ sortDirection: 'ascending' });
        }
        else {
          if(this.state.sortedColumn !== key){
            tmpData.sort((a,b) => (a.age - b.age));
            this.setState({ sortDirection: 'ascending' });
          } else {
            this.reverseSorting(tmpData);
          }
        }
        this.toggleArrow(1);
        break;
      case "string":
        if (this.state.sortDirection === 'descending' || isFirstSort) {
          tmpData.sort((a, b) => a["name"].localeCompare(b["name"]));
          this.setState({ sortDirection: 'ascending' });
        }
        else {
          if(this.state.sortedColumn !== key) {
            tmpData.sort((a, b) => a["name"].localeCompare(b["name"]));
            this.setState({ sortDirection: 'ascending' });
          } else {
            this.reverseSorting(tmpData);
          }
        }
        this.toggleArrow(0);
        break;
      case "date":
        if (this.state.sortDirection === 'descending') {
          tmpData.sort((a, b) => (a.date - b.date));
          this.setState({ sortDirection: 'ascending' });
        }
        else {
          this.reverseSorting(tmpData);
        }
        break;
      default:
        alert("This should never happen XD");
    }
    this.setState({ sortedColumn: key });
    this.setState({ sortedDataSet: tmpData });
    this.paginateData();
  }

  reverseSorting = (data) => {
    data.reverse();
    this.setState({ sortDirection: 'descending' });
  }

  toggleArrow = (index) => {
    if (this.state.sortDirection === "ascending") {
      this.toggleArrowUpHidden(index);
    }
    else if (this.state.sortDirection === "descending") {
      this.toggleArrowDownHidden(index);
    }
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

  filterData = (keyword) => {
    this.setState({ filteredDataSet: this.state.filteredDataSet.filter((keyword, index) => this.props.allDataSet.lastIndexOf(keyword) === index) });
  }

  toggleArrowUpHidden(index) {
    let newState = this.state.isArrowUpHidden.slice();
    newState[index] = !this.state.isArrowUpHidden[index];
    this.setState({
      isArrowUpHidden: newState
    })
  }

  toggleArrowDownHidden(index) {
    let newState = this.state.isArrowDownHidden.slice();
    newState[index] = !this.state.isArrowDownHidden[index];
    this.setState({
      isArrowDownHidden: newState
    })
  }

  componentDidMount() {
    this.sortData(this.props.defaultSortParam, true);
    this.paginateData();
  }

  render() {

    return (
      <div className="wrapper">
        <table className="items">
          <thead>
            <tr>{this.props.columnNames.map((item, index) => <th onClick={() => { this.sortData(item.key, false) }}>{!this.state.isArrowUpHidden[index] && <FontAwesomeIcon icon={faArrowUp} />}{!this.state.isArrowDownHidden[index] && <FontAwesomeIcon icon={faArrowDown} />}{item.label}</th>)}</tr>
          </thead>
          <tbody>
            {this.state.paginatedDataSet.map(item => <ReactiveTableItem data={item}
              columnNames={this.props.columnNames} />)}
            <tr>{this.props.columnNames.map(item => <input type="text" placeholder="Filter column" onChange={() => { this.filterData("a") }}></input>)}</tr>
          </tbody>
        </table>
        <button onClick={this.goToNextPage}>Next page</button>
        <button onClick={this.goToPreviousPage}>Previous page</button>
      </div>
    );
  }
}

export default ReactiveTable;
