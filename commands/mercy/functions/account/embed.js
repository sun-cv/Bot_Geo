class Embed {

	static field(field, style = [], padding) {
		field = this.applyStyle(field, style);
		let output = '';
		output = '⠀'.repeat(padding) + `${field}`;
		return output;
	}

	static divider({ start, main, end, length, padding, centerDesign }) {

		start = start || main;
		end = end || main;
		padding = padding || 0;
		centerDesign = centerDesign || '';

		let divider = '';
		if (centerDesign === '') {
			divider = '⠀'.repeat(padding) + start + main.repeat(length) + end;
		}
		else {
			const halfLength = Math.floor((length - centerDesign.length) / 2);
			divider = '⠀'.repeat(padding) + start + main.repeat(halfLength) + centerDesign + main.repeat(halfLength) + end;
		}
		return divider;
	}


	static center(inputText, maxLineLength = 51, style, styleInclusive = false, padding = '⠀') {
		const totalPaddingSize = Math.max(maxLineLength - inputText.length, 0);
		const leftPaddingSize = Math.floor(totalPaddingSize / 2);
		const rightPaddingSize = totalPaddingSize - leftPaddingSize;
		const leftPadding = padding.repeat(leftPaddingSize);
		const rightPadding = padding.repeat(rightPaddingSize);
		if (styleInclusive) { return inputText = this.applyStyle((leftPadding + inputText + rightPadding), style); }
		else if (style) { inputText = this.applyStyle(inputText, style); }

		return leftPadding + inputText + rightPadding;
	}


	static pad(number, character) {
		const embedLine = '';
		const embedPadLine = `${embedLine.padEnd(number, character)}`;
		return embedPadLine;
	}


	static applyStyle(text, style) {
		if (style.includes('bold')) text = `**${text}**`;
		if (style.includes('italic')) text = `*${text}*`;
		if (style.includes('underscore')) text = `__${text}__`;
		if (style.includes('strikethrough')) text = `~~${text}~~`;
		if (style.includes('spoiler')) text = `||${text}||`;
		if (style.includes('block_code')) text = `\`\`\`${text}\`\`\``;
		else if (style.includes('code')) text = `\`${text}\``;
		if (style.includes('block_quote')) text = `>>> ${text}`;
		else if (style.includes('quote')) text = `> ${text}`;
		if (style.includes('new_line')) text = `${text}\n`;
		return text;
	}

	static truncate({ string, limit, style, pad, indicator, add, alignment }) {

		string = string || '⠀';
		limit = limit || 0;
		style = style || [];
		pad = pad || false;
		indicator = indicator || '..';
		add = add || ' ';
		alignment = alignment || 'left';
		let result = string;

		if (string.length > limit) {
			result = `${string.slice(0, limit - indicator.length)}${indicator}`;
		}
		if (result.length < limit && pad) {
			while (result.length < limit) {
				if (alignment === 'center') {
					result = `${add}${result}${add}`;
				}
				else if (alignment === 'right') {
					result = `${add}${result}`;
				}
				else {
					result += `${add}`;
				}
				if (result.length > limit) {
					result = result.slice(0, limit); 
				}
			}
		}
		if (style) {
			result = this.applyStyle(result, style);
		}
		return result;
	}

	static formatLine(leftText, rightText, maxLineLength) {
		const spaceCount = maxLineLength - leftText.length - rightText.length;
		const spaces = '⠀'.repeat(spaceCount > 0 ? spaceCount : 0);

		return `${leftText}${spaces}${rightText}`;
	}

	static selection(identifier, token, field, style) {

		if (identifier !== token) return `${field}`;

		return this.applyStyle(`${field}`, style);
	}

	static answer(identifier, token, field, style = []) {

		if (field === 'null' || field === '' || field === undefined || field === 'undefined' || field.toLowerCase() === '[object object]' ) {
			field = '⠀';
		}
		if (identifier !== token) {
			return this.applyStyle(field, style);
		}
		else {
			return this.applyStyle(`> ${field}`, style);
		}
	}


}

module.exports = {
	Embed,
};