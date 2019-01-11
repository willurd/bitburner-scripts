// https://www.reddit.com/r/Bitburner/comments/a8ih3j/script_to_manually_hack_servers_to_get_faction/
export function inject(ns, code) {
  let id = '' + Math.random() + Math.random();
  let output = `<style onload="${code} document.getElementById('${id}').remove();"`;
  output += ` id="${id}" ></style>`;
  ns.tprint(output);
}

// https://www.reddit.com/r/Bitburner/comments/a8ih3j/script_to_manually_hack_servers_to_get_faction/
export function cmd(ns, cmd) {
  let code = `document.getElementById('terminal-input-text-box').value = '${cmd}';`;
  code += "document.body.dispatchEvent(new KeyboardEvent('keydown', {";
  code += 'bubbles: true, cancelable: true, keyCode: 13 }));';
  inject(ns, code);
}
