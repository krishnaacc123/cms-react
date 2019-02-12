import React, { Component } from "react";
import MDX from 'mdx-scoped-runtime';
import Prism from "prismjs";
import InnerHTML from 'dangerously-set-inner-html';
// import loadLanguages from 'prismjs/components';
// loadLanguages(['php', 'java', 'pyhon', 'aspnet', 'ruby']);

export const setupPreview = mdxProps => props => <MdxPreview mdx={mdxProps} {...props} />;
export function MdxPreview({ value, mdx }) {
  return (
    <div className="content">
      <MDX {...mdx}>{value}</MDX>
    </div>
  );
}

const extractFromParenthesis = text => {
  const items = [];
  let temp;
  const parenthesisReg = (/\((.*?)\)/g);
  do {
    temp = parenthesisReg.exec(text);
    if (temp) {
        items.push(temp[1]);
    }
  } while (temp);
  return items;
}

const reactInnerText = elt => {
  let x = {
    text: '',
    react: []
  };
  for (var i = 0; i < elt.length; i++) { 
    if(typeof elt[i] === 'string') 
      x.text += elt[i];
    else if(typeof elt[i] === 'object') {
      console.log("react:",elt[i]);
      x.text += "&&&";
      x.react.push(elt[i]);
    }
  } 
  return x;
}

/*---React custom elements-----*/

export const Codeplay = props => (
  <div className="codeplay">
    <div>
      <label>
        <p>Card Number:</p>
      </label>
      <input id="card_number" type="tel" placeholder="XXXX XXXX XXXX XXXX" maxlength="19"/>
      <label id="card_type"></label>
      <label id="card_valid"></label>
    </div>
    <div>
      <label>
        <p>Expiry:</p>
      </label>
      <input id="card_expiry" type="tel" placeholder="Expiry" maxlength="7"/>
      <label id="expiry_valid"></label>
    </div>
    <div>
      <label>
        <p>CVV:</p>
      </label>
      <input id="card_cvv" type="password" placeholder="CVV" maxlength="4"/>
    </div>
  </div>
);

export const Callout = props => (
  <callout {...props} className={props.type}></callout>
);

export const Code = ({label, children}) => {
  const codeLabel = label ? (
    <div className="codeblock-label">
      {label}
    </div>
  ) : null;
  let highlightedCode = null;

  try {
    highlightedCode = Prism.highlight(children || "", Prism.languages.javascript, 'javascript');
  }
  catch(err) {
    console.log(err);
  }
  return (
    <div className="codeblock">
      {codeLabel}
      <div className="code-container">
        <pre>
          <code>
            <InnerHTML html={highlightedCode} />
          </code>
        </pre>
      </div>
    </div>
  )
};

//TODO: Add other Languages support for Prism 
//TODO: Add newline support inside code
export class Codes extends Component {
  constructor(props) { 
    super(props); 
    this.state = { activeTab : 0 }; 
  }

  clickHandler(index) {
    this.setState({activeTab : index});
  }

  render() {
    let {labels, children} = this.props;
    labels = labels.split(",");
    console.log("labels:",labels);
    console.log("children:",children);
    if(labels.length !== children.length) {
      return (
        <p>Label and code count does not match!!!</p>
      )
    };
    const codeLabel = (
      <div className="code-labels">
        {
          labels.map((label, i) => (
              <label key={i} className={this.state.activeTab === i ? "active" : null} onClick={this.clickHandler.bind(this,i)}>{label}</label>
          ))
        }
      </div>
    );
    
    let highlightedCode = [];
    children.forEach((item,i) => {
      // let codeLanguage = labels[i].toLowerCase(), translator;
      // switch (codeLanguage) {
      //   case 'python':
      //     translator = Prism.languages.javascript;
      //     break;
      //   case 'php':
      //     translator = Prism.languages.php;
      //     break;
      //   case 'ruby':
      //     translator = Prism.languages.php;
      //     break;
      //   case 'java':
      //     translator = Prism.languages.php;
      //     break;
      //   case 'aspnet':
      //     translator = Prism.languages.php;
      //     break;
      //   default:
      //     translator = Prism.languages.javascript
      // }
      // highlightedCode.push(Prism.highlight(item, translator, labels[i]));
      highlightedCode.push(Prism.highlight(item, Prism.languages.javascript, labels[i]));
    });
    return (
      <div className="codeblock">
        {codeLabel}
        <div className="code-container">
          <pre>
            {
              highlightedCode.map((codes, i) => (
                <code key={i} className={ this.state.activeTab === i ? "active" : "hide"}>
                  <InnerHTML html={codes} />
                </code>
              ))
            }
          </pre>
        </div>
      </div>
    )
  }
};

export const SmallCode = props => (
  <code {...props} className="small-code"></code>
);

export const DescList = props => {
  const textAndReactElts = reactInnerText(props.children||'');
  const text = textAndReactElts.text;
  const reactElts = textAndReactElts.react;
  const squareReg = /\[(.*?)\]/;
  let items = extractFromParenthesis(text);
  let reactEltToReplace = 0;

  items = items.map((item, i) => {
    try {
      const data = item.trim().split('::');
      const name = data[0].split('[')[0];
      let type = squareReg.exec(data[0]) ? squareReg.exec(data[0])[0] : null;
      let array = data[1].split('&&&');
      let i = array.length - 1, insertAt = 1;
      while(i) {
        array.splice(insertAt, 0, reactElts[reactEltToReplace]);
        reactEltToReplace++;
        insertAt += 2;
        i--;
      }
      return (
         <React.Fragment key={i}>
          <dt>
            <code>{name}</code> 
            {type ? <em>{type}</em> : null}
          </dt>
          <dd>
            {array}
          </dd>
        </React.Fragment>
      );
    } catch(err) {
      console.log(err);
    }
    return item;
  });
  return (
    <dl {...props}>
      {items}
    </dl>
  )
};

export const Link = props => (
  <a href={props.href} {...props}></a>
);

export const Video = props => (
  <iframe 
    className="video"
    width="560" 
    height="315" 
    src={props.children || ''} 
    frameborder="0" 
    allow="autoplay;" 
    encrypted-media="" 
    allowfullscreen="">
  </iframe>
)
/*----custom markdown------*/

export const h1 = props => (
  <h1 className="page-title" {...props}>
  </h1>
);

export const h2 = props => (
  <h2 {...props}>
    <a href={`#${props.children}`} className="header-link">
      {props.children}
      <span class="header-anchor">#</span>
    </a>
  </h2>
);

export const ol = props => (
  <ol className="ol" {...props}></ol>
);

export const h3 = props => (
  <h3 {...props}>
    <a href={`#${props.children}`} className="header-link">
      {props.children}
      <span class="header-anchor">#</span>
    </a>
  </h3>
);
