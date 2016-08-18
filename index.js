var test_data = [-10, -5, -2, 4, 6, 20, 7, 3, 0, -2, -4,
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
        var w = this.props.width/num_data - 1;

        // figure out the y axis
        var min_data = Math.min(0,Math.min.apply(Math,this.props.data));
        var max_data = Math.max(0,Math.max.apply(Math,this.props.data));

        var y_scale = d3.scaleLinear()
            .domain([min_data, max_data])
            .range([0,this.props.height]);
        var zero_height = this.props.height-y_scale(0);
        var h = function (d) {return Math.abs(y_scale(d)-y_scale(0)) || 1;};
        var y = function (d) {return d<0 ? zero_height : zero_height - h(d);};

        d3.select('#'+this.props.graph_id)
            .selectAll('rect')
            .data(this.props.data)
            .enter()
            .append('rect')
            .attr('x', function(d,i){return i*(w+1)})
            .attr('y',y)
            .attr('width', w)
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
        <TimeSeries height={300} width={200} data={test_data} graph_id={'total_budget_spend'}/>
    </div>,
    document.getElementById('content')
)