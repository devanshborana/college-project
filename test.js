const code = `#include <stdio.h>\nint main() { printf("hello") }`;
fetch('https://ce.judge0.com/submissions?wait=true&base64_encoded=true', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    source_code: Buffer.from(code).toString('base64'), 
    language_id: 50 
  })
})
.then(r => r.json())
.then(data => {
  if (data.compile_output) data.compile_output = Buffer.from(data.compile_output, 'base64').toString('utf8');
  if (data.stderr) data.stderr = Buffer.from(data.stderr, 'base64').toString('utf8');
  if (data.stdout) data.stdout = Buffer.from(data.stdout, 'base64').toString('utf8');
  console.log(data);
});
