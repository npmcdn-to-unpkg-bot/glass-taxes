var test_data = [-10, -5, -2, 4, 6, 20, 7, 3, 0, -2, -4,
                     -3, 0, 5, 3, 2, 1, 3, 8, 10];

ReactDOM.render(
	<div>
		<h2>Sample Data</h2>
    	<BarChart height={300} width={500} data={test_data} graph_id={'test_bar_chart'}/>
	</div>,
	document.getElementById('content')
);