var test_data = [-10, -5, -2, 4, 6, 10, 7, 3, 0, -2, -4,
                     -3, 0, 5, 3, 2, 1, 3, 8, 10];

var TimeSeries = React.createClass({
    render: function(){
        return (
            <svg height={this.props.height} width={this.props.width} id={this.props.graph_id}></svg>
        );
    },
    componentDidMount: function(){
        // figure out the x axis
        var num_data = this.props.data.length;
        var width = this.props.width/num_data - 1;
        console.log(width)

        // figure out the y axis
        var min_data = Math.min.apply(null,this.props.data);
        var max_data = Math.max.apply(null,this.props.data);
        var y_range = max_data-Math.min(0,min_data);

        var zero_height;
        if (max_data<0) zero_height = 0;
        else if (min_data>0) zero_height = this.props.height;
        else zero_height = this.props.height*(max_data/(max_data-min_data));

        // helper function to compute the height since it is used in the
        // 'height' attribute as well as the 'y' attribute
        var h = function(d,i){
            return Math.max(Math.abs(d)/y_range*this.props.height,1)
        }.bind(this);

        d3.select('#'+this.props.graph_id)
            .selectAll('rect')
            .data(this.props.data)
            .enter()
            .append('rect')
            .attr('x', function(d,i){
                return i*(width+1)
            })
            .attr('y', function(d,i){
                return d<0 ? zero_height : zero_height - h(d,i);
            })
            .attr('width',width)
            .attr('height', h)
            .attr('fill', function(d,i){
                if (d<0) return 'rgb(204,0,0)'
                else if (d>0) return 'rgb(0,153,0)'
                else return 'black'
            })
    }
});


ReactDOM.render(
    <div>
        <h1>GlassTaxes</h1>
        <TimeSeries height={300} width={2 00} data={test_data} graph_id={'total_budget_spend'}/>
    </div>,
    document.getElementById('content')
)