var test_data = [-10, -5, -2, 4, 6, 20, 7, 3, 0, -2, -4,
                     -3, 0, 5, 3, 2, 1, 3, 8, 10];

var accessor = function(d){return d;}
var get_test_data = function(cb){
	cb(test_data);
}

var formatting = {
	fill:function(d){
		if (accessor(d)>0) return 'rgb(0,153,0)';
		else if (accessor(d)<0) return 'rgb(204,0,0)';
        else return 'black';
	}
};

ReactDOM.render(
	<div>
		<h2>Sample Data</h2>
    	<BasicBarChart height={300}
    				   width={500}
    				   data={get_test_data}
    				   graph_id={'test_bar_chart'}
    				   accessData={accessor}
    				   formatting={formatting}/>
	</div>,
	document.getElementById('content')
);