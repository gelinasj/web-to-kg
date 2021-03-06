import React from "react";
import { autocomplete } from "../auxillary/autocomplete.js";
import "../auxillary/style.css";

export default class GraphItemAutoComplete extends React.Component {

  componentDidMount() {
    const { onSelect, doc, searchType } = this.props;
    const autocompleteInput = doc.getElementById("graphItemAutocompleteInput");
    if(autocompleteInput !== null) {
      autocomplete(autocompleteInput, onSelect, doc, searchType);
    }
  }

  render() {
    const { searchType } = this.props;
    return (
      <form autoComplete="off" action="/action_page.php">
          <div className="autocomplete" style={{width:"300px"}}>
            <input id="graphItemAutocompleteInput" type="text" name="graphItemSearch" placeholder={`Search for ${searchType}`}/>
          </div>
      </form>
    );
  }
}
