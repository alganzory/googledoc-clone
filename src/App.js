import TextEditor from "./TextEditor";
import DocumentsList from "./DocumentsList";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>

        <Route path="/documents/:id">
          <TextEditor />;
        </Route>

        <Route path= "/documents" exact>
          <DocumentsList />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
