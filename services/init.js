import { apicase } from '@apicase/core';
import fetch from '@apicase/adapter-fetch';

const doRequest = apicase(fetch);

doRequest({ url: '/api/posts' })
  .on('done', res => console.log('Success'))
  .on('fail', res => console.log('Failed but it is OK'))
  .on('error', err => console.log('JS Error', err))
  .on('cancel', _ => console.log('Request was cancelled'))
  .on('progress', p => console.log('XHR progress', p.loaded / p.total));
