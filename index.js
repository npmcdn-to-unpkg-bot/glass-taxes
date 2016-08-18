var test_data = [-10, -5, -2, 4, 6, 20, 7, 3, 0, -2, -4,
                     -3, 0, 5, 3, 2, 1, 3, 8, 10];

var TimeSeries = React.createClass({
    render: function(){
        return (
            <svg height={this.props.height} width={this.props.width} id={this.props.graph_id}></svg>
        );
    },
    componentDidMount: function(){
        var padding = 30;

        // figure out the x axis
        var num_data = this.props.data.length;
        var w = (this.props.width-2*padding)/num_data - 1;
        var x_scale = d3.scaleLinear()
            .domain([0, this.props.data.length-1])
            .range ([padding,this.props.width-padding])

        // figure out the y axis
        var min_data = Math.min(0,Math.min.apply(Math,this.props.data));
        var max_data = Math.max(0,Math.max.apply(Math,this.props.data));

        var y_scale = d3.scaleLinear()
            .domain([min_data, max_data])
            .range([this.props.height-padding, padding]);
        var zero_height = y_scale(0);
        var h = function (d) {return Math.abs(y_scale(d)-y_scale(0)) || 1;};
        var y = function (d) {return d<0 ? zero_height : zero_height - h(d);};

        //locate the drawing board
        var svg = d3.select('#'+this.props.graph_id);

        //plot the axes
        var x_axis = d3.axisBottom(x_scale)
            .ticks(0);
        var y_axis = d3.axisLeft(y_scale);

        svg.append('g')
            .call(x_axis)
            .attr('transform','translate(0,'+zero_height+')');
        svg.append('g')
            .call(y_axis)
            .attr('transform','translate('+padding+','+ 0 +')');
        
        //plot the bars
        svg.selectAll('rect')
            .data(this.props.data)
            .enter()
            .append('rect')
            .attr('x', function(d,i){return padding+i*(w+1)})
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
        <TimeSeries height={300} width={500} data={test_data} graph_id={'total_budget_spend'}/>
    </div>,
    document.getElementById('content')
)