const Group = require('../models/Group')
const User = require('../models/User')

async function createGroup(req, res) {
    try {
        const { name } = req.body
        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Group name is required" });
        }
        const groupRes = new Group({ name, createdBy: req.userId, members: [req.userId] })

        await groupRes.save();
        res.status(201).json({ message: "Group created successfully" })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }

}

async function addMember(req, res) {
    try {
        const { groupId } = req.params
        const { email } = req.body
        const user = await User.findOne({email})
        const groupRes = await Group.findById(groupId)

        if (!user) {
            return res.status(404).json({ error: "No user found with that email" });
        }

        if (!groupRes) {
            return res.status(404).json({ error: "Group doesn't exist" })
        }
        if (groupRes.members.some(m => m.toString() === user._id.toString())) {
            return res.status(400).json({ error: "User already exists in the group" })
        }
        groupRes.members.push(user._id)
        await groupRes.save()

        res.status(200).json(groupRes)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }


}

async function getMyGroups(req, res) {
    try {
        const userId = req.userId

        const groupRes = await Group.find({ members: req.userId })

        res.status(200).json(groupRes)

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }

}

async function getGroupMembers(req, res) {
    try {
        const { groupId } = req.params
        const group = await Group.findById(groupId).populate('members', 'name email')

        if (!group) {
            return res.status(404).json({ error: "Group doesn't exist" })
        }

        res.status(200).json(group.members)

    } catch (error) {

        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }

}

module.exports = { createGroup, addMember, getMyGroups, getGroupMembers };