import React, {Component} from 'react';

export class ImageTextList extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let {list} = this.props;
        let listComponent = list.map ( (element,index) =>{
            return (
                <li key={index}>
                    <img src={element.url}/>
                    <p>{element.text}</p>
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