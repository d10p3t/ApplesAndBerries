var sendAjax = function(values, link, success_function){
	return $.ajax({
		url: link,
		type: "POST",
		datatype: "json",
		data: JSON.stringify(values),
		contentType: "application/json; charset=utf-8",
		cache: "false",
		timeout: "10000",
		complete: function(){
			console.log('process complete')
		},
		success: success_function(),
		error: function(){
			console.log('process error')
		},
	});
}


$('#print-petty-cash-button').click(function(){
	$('table').printThis({
		header: "<div style='width: 100%; margin: 0 auto;'><img style='width: 20%;' src='images/header.png'></img></div>"
	});
});

$('#delete-pettyCash-button').click(function(){
	var checkboxes = $('.ui.checkbox input:checked').map(function(i, element){
		return $(element).data('an');
	});
	//- console.log(checkboxes);
	sendAjax(checkboxes, '/deletePettycash', function(){
		console.log('process success');
		window.location.reload();
	})
	.then((data) => {
		console.log(data);
		console.log('process success');
	});
});

$(document).ready(function(){
	$('#petty-cash-view-table').DataTable();
});