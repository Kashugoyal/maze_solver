class Node{
    constructor(x, y, occupied=false){
        this.x = x;
        this.y = y;
        this.occupied = occupied;
        this.parent = null;
        this.score = null;
    }

}


class Maze{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.dirs = [[0,1], [1,0], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, -1], [-1, 1]];
        // this.dirs = [[0,1], [1,0], [-1, 0], [0, -1]];
        this.list = new Array(height);
        for (let i = 0; i < height; i++) {
            var row = new Array(width);
            for (let j = 0; j < width; j++) {
                row[j] = new Node(i, j,false);
            }
            this.list[i] = row;
        }
        this.source = null;
        this.dest = null;
    }

    setObstacle(coordinates, val){
        let [x,y] = coordinates;
        this.list[x][y].occupied = val;
    }

    setSource(coordinates){
        this.source = coordinates;
    }

    setDest(coordinates){
        this.dest = coordinates;
    }

    getNeighbors(node){
        let neighbors = [];
        this.dirs.forEach((dir) => {
            let [x, y] = [node.x + dir[0], node.y + dir[1]];
            if(x < 0 || x > this.width -1 || y < 0 || y > this.width -1 ){
                return
            }
            let nbr = this.list[x][y];
            if(!nbr.occupied)
                neighbors.push(nbr)
        })
        return neighbors
    }

    print(){
        let outstr = '';
        this.list.forEach(row => {
            row.forEach(vert => {
                if(this.dest && vert.x === this.dest[0] && vert.y === this.dest[1]){
                    outstr += '|B| ';
                }
                else if(this.source && vert.x === this.source[0] && vert.y === this.source[1]){
                    outstr += '|A| ';
                }
                else if(vert.occupied){
                    outstr += '|0| '
                }
                else{
                    outstr += '|_| ';
                }
            });
            outstr += '\n';
        });
        console.log(outstr)
    }

    printPath(tree){
        let dest = tree;
        let path = [];
        let src = dest;
        while(src.parent){
            path.push(src);
            src = src.parent;
        }
        let outstr = '';
        this.list.forEach(row => {
            row.forEach(vert => {
                if(vert == dest){
                    outstr += '|B| ';
                }
                else if(vert == src){
                    outstr += '|A| ';
                }
                else if(path.includes(vert)){
                    outstr += '|*| ';
                }
                else if(vert.occupied){
                    outstr += '|0| '
                }
                else{
                    outstr += '|_| ';
                }
            });
            outstr += '\n';
        });
        console.log(outstr)
    }

    Solve(){
        let source = this.source;
        let dest = this.dest;
        if(source[0]==dest[0] && source[1]==dest[1]){
            return null
        }
        let start_node = this.list[source[0]][source[1]];
        start_node.score = 0;
        let open_list = new SortedList();
        open_list.push(start_node, start_node.score);
    
        while (open_list.length){
            var [node, prio] = open_list.pop()
            var neighbors = this.getNeighbors(node);
            for (let i = 0; i < neighbors.length; i++) {
                const nbr = neighbors[i];
                let h = distance([nbr.x, nbr.y], dest);
                let f = distance([node.x, node.y], [nbr.x, nbr.y]);
                let new_score = node.score + f;
                if(nbr.x == dest[0] && nbr.y == dest[1]){
                    nbr.parent = node;
                    nbr.score = new_score;
                    return nbr
                }
                if (nbr.score != null && new_score > nbr.score){
                    continue
                }
                nbr.score = new_score;
                nbr.parent = node;
                open_list.push(nbr, new_score + h);
            }
        }
        return null
    }
}

class SortedList{
    constructor(){
        this.sorted_list= [];
        this.elem_list = [];
    }

    push(inp, score){
        if(!this.length){
            this.sorted_list.push([inp,score])
            this.elem_list.push(inp);
            return
        }
        for (var i = this.sorted_list.length -1; i >= 0; i--) {
            const element = this.sorted_list[i];
            if(score <= element[1]){
                this.sorted_list.splice(i + 1, 0, [inp, score]);
                this.elem_list.push(inp);
                break
            }
        }
        if(i < 0){
            this.sorted_list.splice(0, 0, [inp, score]);
            this.elem_list.push(inp);
        }
    }
    pop(){
        return this.sorted_list.pop();
    }

    includes(elem){
        return this.elem_list.includes(elem); 
    }
    
    get length(){
        return this.sorted_list.length
    }
}

function distance(src, dst){
    return Math.sqrt((src[0] -dst[0])**2 + (src[1] -dst[1])**2)
}

function manhattenDistance(src, dest){
    let x_dist = Math.abs(dest[0] - src[0]);
    let y_dist = Math.abs(dest[1] - src[1]);
    return x_dist + y_dist
}

export default Maze;

// let map = new Maze(10,10)
// map.setObstacle([3,3], [0,3],[1,3], [2,3],[4,3], [5,3],[4,6],[5,6], [6,6],[7,6], [8,6], [9,6])
// let sol = map.Solve([0,0], [9,9])
// map.printPath(sol)

