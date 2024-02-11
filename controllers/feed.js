const { validationResult } = require('express-validator/check');
const fs = require('fs');
const path = require('path');

const Post = require('../models/post');
const User = require('../models/user');

// GET POSTS //
exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const numberOfPosts = 2;
    let totalCount;

    Post.find()
        .countDocuments()
        .then((count) => {
            totalCount = count;

            return Post.find()
                .skip((currentPage - 1) * numberOfPosts)
                .limit(numberOfPosts);
        })

        .then((posts) => {
            res.status(200).json({
                message: 'Fetched posts successfully.',
                posts: posts,
                totalItems: totalCount,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// CREATE POST //
exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(
            'Validation failed, entered data is incorrect.'
        );
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.destination + '/' + req.file.filename;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,
    });
    post.save()
        .then((result) => {
            return User.findById(req.userId);
        })
        .then((user) => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then((result) => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: post,
                creator: { _id: creator._id, name: creator.name },
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// GET SINGLE POST

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Post fetched.', post: post });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// UPDATE POST //
exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl;

    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }

            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }

            if (!req.file) {
                imageUrl = post.imageUrl;
            } else {
                imageUrl = req.file.destination + '/' + req.file.filename;

                const pathToDelte = post.imageUrl;
                const pathtTo = path.join(__dirname, '../', pathToDelte);
                fs.unlink(pathtTo, (err) => {
                    console.log(err);
                });
            }

            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            post.save();

            return res.status(201).json({
                message: 'Post Updated Successfully',
                post: post,
            });
        })
        .catch((error) => {
            next(error);
        });
};

//DELETE POST
exports.deletePost = (req, res, next) => {
    const id = req.params.postId;

    Post.findById(id)
        .then((post) => {
            if (!post) {
                const error = new Error('Post did not find!');
                error.statusCode = 404;
                throw error;
            }

            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }

            if (post.imageUrl) {
                const pathToDelte = post.imageUrl;
                const pathtTo = path.join(__dirname, '../', pathToDelte);
                console.log(pathToDelte);
                console.log(pathtTo);
                fs.unlink(pathtTo, (err) => {
                    console.log(err);
                });
            }

            return Post.deleteOne({ _id: id });
        })

        .then((result) => {
            console.log('Post Deleted Successfully');
            res.status(200).json({
                message: 'Post deleted Successfully',
                post: result,
            });
        })

        .catch((error) => {
            next(error);
        });
};
