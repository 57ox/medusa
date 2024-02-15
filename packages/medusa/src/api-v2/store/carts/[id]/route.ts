import { updateCartsWorkflow } from "@medusajs/core-flows"
import { UpdateCartDataDTO } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

import { defaultStoreCartRemoteQueryObject } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const query = {
    cart: {
      __args: variables,
      ...defaultStoreCartRemoteQueryObject,
    },
  }

  const [cart] = await remoteQuery(query)

  res.json({ cart })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const updateCartWorkflow = updateCartsWorkflow(req.scope)

  const workflowInput = {
    selector: { id: req.params.id },
    update: req.validatedBody as UpdateCartDataDTO,
  }

  const { result, errors } = await updateCartWorkflow.run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ cart: result[0] })
}