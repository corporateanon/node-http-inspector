import { LoggerEvent, LoggerHeaders, LoggerError } from './SharedTypes';

const LINE_SEP = '------------------------------------------------';

const renderHeading = ({ request, response, error }: LoggerEvent) => {
    const statusLine = response ? response.status : error ? error.message : '';
    return `${request.method} ${request.url}\n${
        request.remoteAddress ?? 'IP unknown'
    }\n > ${statusLine}`;
};

const renderHeaders = (headers: LoggerHeaders) =>
    Object.keys(headers)
        .map((name) => `  ${name}: ${headers[name]}`)
        .join('\n');

const renderBody = (headers: LoggerHeaders, body: Buffer | null) =>
    body ? body.toString('utf8') : ' <empty>';

const renderError = (error: LoggerError) => {
    return [
        `  Code: ${error.code}`,
        `  Message: ${error.message}`,
        `  Stack: ${error.stack}`,
    ].join('\n');
};

export default function eventToPretty(event: LoggerEvent): string {
    const parts = [];
    parts.push(LINE_SEP);
    parts.push(renderHeading(event));
    parts.push('Request headers:');
    parts.push(renderHeaders(event.request.headers));
    parts.push('Request body:');
    parts.push(renderBody(event.request.headers, event.request.body));

    if (event.response) {
        parts.push('Response headers:');
        parts.push(renderHeaders(event.response.headers));
        parts.push('Response body:');
        parts.push(renderBody(event.response.headers, event.response.body));
    }

    if (event.error) {
        parts.push('Error:');
        parts.push(renderError(event.error));
    }
    parts.push(LINE_SEP);

    return parts.join('\n');
}
