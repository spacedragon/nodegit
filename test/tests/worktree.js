var path = require("path");
var assert = require("assert");
var local = path.join.bind(path, __dirname);

describe("Worktree", function () {
  var NodeGit = require("../../");
  var Repository = NodeGit.Repository;
  var Worktree = NodeGit.Worktree;
  var Clone = NodeGit.Clone;

  var clonePath = local("../repos/clone");
  var worktreePath = local("../repos/worktree");

  // Set a reasonable timeout here now that our repository has grown.
  this.timeout(30000);

  before(function () {
    var test = this;
    var url = "https://github.com/nodegit/test.git";
    var opts = {
      fetchOpts: {
        callbacks: {
          certificateCheck: () => 0
        }
      }
    };

    return Clone(url, clonePath, opts).then(function (repo) {
      assert.ok(repo instanceof Repository);
      test.repository = repo;
    });
  });

  it("can create worktree", function () {
    return Worktree.add(this.repository, "workspace", worktreePath, {})
      .then(function (wt) {
        assert.ok(wt instanceof Worktree);
      });
  });

  it("can open a worktree repository", function () {
    return Repository.open(worktreePath).then(function (repo) {
      assert.ok(repo instanceof Repository);
      assert.ok(repo.isWorktree());
    });
  });

  it("can prune worktree", function () {
    const repository = this.repository;
    return Worktree.lookup(repository, "workspace")
      .then(function (wt) {
        assert.ok(wt instanceof Worktree);
        wt.prune({flags: 1});
        return assert.rejects(Worktree.lookup(repository, "workspace"));
      });
  });

});
