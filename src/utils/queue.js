function queue() {
  var _currJobIndex = 0;
  var _catch = dsf.noop;
  var _finally = dsf.noop;
  var _jobs = [];

  this.catch = cb => {
    _catch = cb;
    return this;
  };
  this.finally = cb => {
    _finally = cb;
    return this;
  };
  this.step = cb => {
    _jobs.push(cb);
    return this;
  };

  this.exec = v => {
    if (_currJobIndex < _jobs.length) {
      _jobs[_currJobIndex](
        {
          resolve: next.bind(this),
          reject: toCatch.bind(this)
        },
        v
      );
    } else {
      _finally && _finally();
    }
  };

  function next(v) {
    _currJobIndex++;
    this.exec(v);
  }

  function toCatch(v) {
    _catch && _catch(v);
  }
}

export default function () {
  return new queue();
}

// let q = dsf.queue(), a = 0, b=1;
//        q.step((def, v) => {
//          if (a==b) {
//            def.resolve();
//          }else{
//            def.reject("a不等于b");
//          }
//        });
//        q.catch((err) => {
//          console.log(err);
//        })
//        q.finally(() => {
//          // 队列是一步完成后才能继续下一步
//        })
//        q.exec();
