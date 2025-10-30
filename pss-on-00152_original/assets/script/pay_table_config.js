exports.PayTableConfig = {
	reference_bet: 50,
	element: [
		[
			/*P1: Bonus*/
			{ pay: [100], mark_width: 8, high: 26, position: [-65, -380], Anchor: [0, 0.5], rotation: 0, relative_res: 1 },
		],
		[
			/*P2*/
			{ pay: [50, 200, 500], mark_width: 8, high: 26, position: [-210, 50], Anchor: [0, 0.5], rotation: 0, relative_res: 2 },
			/*P3*/
			{ pay: [30, 100, 300], mark_width: 8, high: 26, position: [80, 50], Anchor: [0, 0.5], rotation: 0, relative_res: 2 },
			/*P4*/
			{ pay: [25, 50, 100], mark_width: 8, high: 26, position: [-210, -380], Anchor: [0, 0.5], rotation: 0, relative_res: 2 },
			/*P5*/
			{ pay: [15, 30, 80], mark_width: 8, high: 26, position: [80, -380], Anchor: [0, 0.5], rotation: 0, relative_res: 2 },
		],
		[
			/*P6*/
			{ pay: [10, 15, 50], mark_width: 8, high: 26, position: [-210, 30], Anchor: [0, 0.5], rotation: 0, relative_res: 3 },
			/*P7 P8*/
			{ pay: [8, 10, 30], mark_width: 8, high: 26, position: [70, 30], Anchor: [0, 0.5], rotation: 0, relative_res: 3 },
			/*P9*/
			{ pay: [5, 10, 20], mark_width: 8, high: 26, position: [-210, -410], Anchor: [0, 0.5], rotation: 0, relative_res: 3 },
			/*P10 P11*/
			{ pay: [5, 10, 20], mark_width: 8, high: 26, position: [70, -410], Anchor: [0, 0.5], rotation: 0, relative_res: 3 },
		],
	],
};