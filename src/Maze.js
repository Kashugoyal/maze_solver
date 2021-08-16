import React from 'react';
import styled from 'styled-components';
import Maze from './search'

class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.colors = {
            0: "#FFDEDE",
            1: "#aaa",
            2: "#C2E784",
            3: "#FF6B6B",
            4: "#0F52BA"
        }
        this.state = {
            category: this.props.category || 0
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let cat = this.state.category;
        cat = (cat + 1) % 4;
        this.props.changeCB(cat);
        this.setState({ category: cat })
    }

    render() {
        const Tile = styled.div`
            min-width: 40px;
            height: 40px;
            background: ${props => this.colors[this.state.category]};
            &:hover {
                background: #F2BB7B;
            }
        `
        return <Tile onClick={this.handleClick}></Tile>
    }
}


class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: Array(100).fill(0),
            mode: '',
            reset: false
        }
        this.map = new Maze(10,10);
        this.reset = this.reset.bind(this);
        this.solve = this.solve.bind(this);
        this.setCategory = this.setCategory.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.reset){
            this.setState({reset: false})
            return true
        }
        return false
    }

    renderTiles() {
        let out = []
        this.state.tiles.forEach((tile, i) => {
            out.push(<Tile key={i} category={tile} changeCB={(category) => this.setCategory(i, category)} id={i}></Tile>)
        })
        return out
    }

    setCategory(index, category) {
        let tiles = this.state.tiles;
        tiles[index] = category;
        switch (category) {
            case 0:
                this.map.setObstacle([index % 10, Math.floor(index/10)], false);
                break;
            case 1:
                this.map.setObstacle([index % 10, Math.floor(index/10)], true);
                break;
            case 2:
                this.map.setObstacle([index % 10, Math.floor(index/10)], false);
                this.map.setSource([index % 10, Math.floor(index/10)]);
                break;
            case 3:
                this.map.setObstacle([index % 10, Math.floor(index/10)], false);
                this.map.setDest([index % 10, Math.floor(index/10)]);
                break;
            default:
                break;
        }
        this.map.print();
        this.setState({ tiles: tiles });
    }

    solve(){
        let sol = this.map.Solve();
        this.map.printPath(sol);
    }

    reset(){
        this.setState({reset:true, tiles: Array(100).fill(0)});
    }

    render() {
        const GridComp = styled.div`
            display: flex;
            flex-direction: row;
            width: 400px;
            background: chartreuse;
            height: 400px;
            margin: auto;
            flex-flow: row wrap;
            justify-content: space-around;

        `
        return <div>
            <GridComp>
                {this.renderTiles()}
            </GridComp>
            <div>
                <button onClick={this.reset}>Reset</button>
                <button onClick={this.solve}>Set</button>
            </div>
        </div>
    }
}



export default Grid;