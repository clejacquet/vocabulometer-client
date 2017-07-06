const express = require('express');
const router = express.Router();
const fs = require('fs');
const Lexer = require('lex');

router.get('/:id', (req, res, next) => {
	req.models.texts.findOne({ _id: req.params.id }, (err, result) => {
		if (err) {
			return next(err);
		}

		if (!result) {
			res.status(404);
			return res.json({
				error: 'Not Found'
			});
		}

		res.status(200);
		res.json({
			text: result.text
		});
	});
});

router.post('/', (req, res, next) => {
	const lexer = new Lexer((char) => {
		next('Error while analyzing \'' + char + '\'');
	});

	let quotationZone = false;

	lexer
		.addRule(/\.\.\./, lexeme => { return { token: 'TRIPLE POINT', value: lexeme } })
		.addRule(/\./, lexeme => { return  { token: 'POINT', value: lexeme } })
		.addRule(/,/, lexeme => { return  { token: 'COMMA', value: lexeme } })
		.addRule(/'/, lexeme => { return  { token: 'APOSTROPHE', value: lexeme } })
		.addRule(/"/, lexeme => {
			const val = { token: ((quotationZone) ? 'OPEN' : 'CLOSE') + ' QUOTATION', value: lexeme };
			quotationZone = !quotationZone;
			return val;
		})
		.addRule(/:/, lexeme => { return  { token: 'COLON', value: lexeme } })
		.addRule(/;/, lexeme => { return  { token: 'SEMI-COLON', value: lexeme } })
		.addRule(/\?/, lexeme => { return  { token: 'QUESTION', value: lexeme } })
		.addRule(/!/, lexeme => { return  { token: 'EXCLAMATION', value: lexeme } })
		.addRule(/-/, lexeme => { return  { token: 'DASH', value: lexeme } })
		.addRule(/\(/, lexeme => { return  { token: 'OPEN PARENTHESE', value: lexeme } })
		.addRule(/\)/, lexeme => { return { token: 'CLOSE PARENTHESE', value: lexeme } })
		.addRule(/\[/, lexeme => { return { token: 'OPEN BRACKET', value: lexeme } })
		.addRule(/]/, lexeme => { return { token: 'CLOSE BRACKET', value: lexeme } })
		.addRule(/[0-9]+/, lexeme => { return { token: 'NUMBER', value: lexeme } })
		.addRule(/[a-zA-ZÀ-ÿ'-]+/, lexeme => { return { token: 'WORD', value: lexeme } })
		.addRule(/\n/, lexeme => { return { token: 'RETURN', value: lexeme } })
		.addRule(/\s/, lexeme => { return { token: 'SPACE', value: lexeme } })
		.addRule(/./, lexeme => { return { token: 'UNDEFINED', value: lexeme } });

	lexer.setInput(req.body.text);

	let results = [];

	let result;
	while (result = lexer.lex()) {
		results.push(result);
	}

	results = results
		.filter(token => !(token.token === 'SPACE' || token.token === 'UNDEFINED'))
		.reduce((acc, token) => {
			try {
				if (token.token === 'RETURN') {
					acc.push([]);
				} else {
					acc[acc.length - 1].push(token);
				}
			} catch (err) {
				console.error(err);
			}

			return acc;
		}, [[]]);

	req.models.texts.create({
		text: {
			title: req.body.title,
			body: results
		}
	}, (err) => {
		if (err) {
			return next(err);
		}
		res.json({
			result: results.map(paragraph => paragraph.map(token => token.value)),
			text: results
		});
	});


});

module.exports = router;