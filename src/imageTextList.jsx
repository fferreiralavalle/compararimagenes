import React, {Component} from 'react';

export class ImageTextList extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let {list,handleIndex} = this.props;
        console.log(handleIndex);
        let listComponent = list.map ( (element,index) =>{
            return (
                <li key={index}>
                <button onClick={handleIndex} name={index}>
                    <img src={element.url} width="120px"/>
                    {element.text}
                </button>
                </li>  
            );
        });
        return (
            <div>
                {listComponent}
            </div>
        );
    }
}