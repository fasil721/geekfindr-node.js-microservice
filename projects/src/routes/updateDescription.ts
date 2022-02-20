import express, { Request, Response } from 'express'
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { param, body } from 'express-validator'

import { Project } from '../models/project'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('projectId').isMongoId().withMessage('Invalid project id'),
  body('description').notEmpty().withMessage('Description is required'),
  validateRequest,
]

router.put(
  '/api/v1/projects/:projectId/description',
  protectRoute,
  requestBodyValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.projectId)
    if (!project) {
      throw new BadRequestError('Project not found')
    }
    project.description = req.body.description
    await project.save()
    res.send(project)
  }
)

export { router as updateDescriptionRouter }
