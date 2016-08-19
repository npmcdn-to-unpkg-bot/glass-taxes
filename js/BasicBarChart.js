var BasicBarChart = React.createClass({
	getInitialState : function(){
		return {data:[]}
	},
	setData : function(data) {
		this.setState({data:data});
	},
	renderData : function() {
		var padding = {
			right:10,
			left:60,
			bottom:30,
			top:10
		};

		var data = this.state.data

		// figure out x-axis
		var num_data = data.length;
        var w = (this.props.width-padding.right-padding.left)/num_data - 1;
        var x = function(d,i){return padding.left+i*(w+1)};
        var x_scale = d3.scaleLinear()
            .domain([0, data.length-1])
            .range ([padding.left,this.props.width-padding.right]);

        // figure out y-axis
        var min_data = Math.min(0,d3.min(data,this.props.accessData));
        var max_data = Math.max(0,d3.max(data,this.props.accessData));

        var y_scale = d3.scaleLinear()
            .domain([min_data, max_data])
            .range([this.props.height-padding.bottom, padding.top]);
        var zero_height = y_scale(0);
        var h = function (d) {return Math.abs(y_scale(this.props.accessData(d))-y_scale(0)) || 1;}.bind(this);
        var y = function (d) {return d<0 ? zero_height : zero_height - h(this.props.accessData(d));}.bind(this);

        // locate the drawing board
        var svg = d3.select('#'+this.props.graph_id);

        // plot the axes
        // TODO: figure out how to label the x axis with non-numeric data
        var x_axis = d3.axisBottom(x_scale).ticks(0);
        var y_axis = d3.axisLeft(y_scale);

        svg.append('g')
            .call(x_axis)
            .attr('transform','translate(0,'+zero_height+')');
        svg.append('g')
            .call(y_axis)
            .attr('transform','translate('+padding.left+','+ 0 +')');

        // plot the data
        var rects = svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', x)
            .attr('y',y)
            .attr('width', w)
            .attr('height', h);

        // apply the rest of the user-defined formatting to the chart
        if (this.props.formatting){
	        for (var f in this.props.formatting){
	        	rects = rects.attr(f, this.props.formatting[f]);
	        }
        }

	},
	clearData : function() {
		d3.select('#' + this.props.graph_id)
			.selectAll('*')
			.remove();
	},
	componentDidMount: function(){
		// handle both callbacks and explicit data
		if(typeof(this.props.data) == 'function'){
			this.props.data(this.setData);
		}else{
			this.setData(this.props.data);
		}
	},
	componentDidUpdate: function(){
		this.clearData();
		this.renderData();
	},
	render : function(){
		return (
			<svg height={this.props.height}
			 width={this.props.width}
			 id={this.props.graph_id}>
			</svg>
		);
	}
});

window.BasicBarChart = BasicBarChart;