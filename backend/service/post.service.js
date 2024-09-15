const postModel = require("../models/post.model");
const fileService = require("./file.service");

class PostService {
  async getAll() {
    const allPosts = await postModel.find().populate("author");
    return allPosts;
  }
  async create(post, picture, author) {
    const fileName = fileService.save(picture);
    const newPost = await postModel.create({
      ...post,
      picture: fileName,
      author,
    });
    return newPost;
  }

  async delete(id) {
    const deletedPost = await postModel.findByIdAndDelete(id);
    return deletedPost;
  }

  async edit(id, body) {
    if (!id) throw new Error("Id not found");

    const updatedData = await postModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return updatedData;
  }

  async getOne(id) {
    const onePost = await postModel.findById(id);
    return onePost;
  }
}

module.exports = new PostService();
